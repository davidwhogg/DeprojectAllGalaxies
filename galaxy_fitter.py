import numpy
import astrohack_projections
import matplotlib.pyplot as plt
from scipy.ndimage.filters import gaussian_filter
import scipy.optimize as op

def construct_illustris_images(num_of_images):
    """
    function returns N images of the same galaxy at different projections
    """
    #file_path = "/Users/dalyabaron/Downloads/cutout_242959.hdf5"
    file_path = "/Users/dalyabaron/Copy/Astrophysics/python/new_scripts/new_scripts/DeprojectAllGalaxies/illustris_galaxies/cutout_83.hdf5"
    illustris_gal = astrohack_projections.illustris_model_and_image(file_path)
    illustris_gal.set_image_shape((30, 40))

    images = []
    for i in xrange(num_of_images):
        xi_hat, eta_hat = astrohack_projections.choose_random_projection()
        alpha, beta, gamma = numpy.random.uniform(0.0, 360.0, 3)
        intensity = 150 #20
        scale = 0.18 * numpy.exp(numpy.random.uniform()) #0.015 * numpy.exp(numpy.random.uniform())
        xshift = numpy.random.uniform(13., 16.)#(29., 31.)
        yshift = numpy.random.uniform(18., 21.)#(39., 41.)
        psf_size = 1 #1.5
        bg = 0.
        
        kwargs = {'alpha':alpha, 'beta':beta, 'gamma':gamma, 'intensity':intensity, 'scale':scale, 'xshift': xshift, 'yshift': yshift, 'bg':0.0, 'psf_size':psf_size}
        illustris_gal.set_image_parameters(**kwargs)
        illustris_gal.construct_image()
        images.append(illustris_gal.get_image())
    return images

def construct_initial_album(illustris_images, psf_blur_size):
    """
    the initial album contains 32 images of the illustris galaxy,
    the images will be a little blured so that 3 Gaussians will be sufficient for the fitting process.
    the album will contain a galaxy_3d_model that contains 3 Gaussians
    """
    num_of_images = len(illustris_images)

    # album and PSF initialisation
    album = astrohack_projections.album_and_model()
    psf = astrohack_projections.mixture_of_gaussians(2)
    psf.add_gaussian(1., numpy.array([0., 0.]), numpy.eye(2)*1.)

    # construct the galaxy using Gaussian mixture
    basevar = 0.5 * numpy.eye(3)
    gal_model = astrohack_projections.galaxy_model_3d()
    for i in xrange(3):
        v = numpy.random.uniform(0, 3, size=3)
        mu = numpy.random.uniform(-3, 3, size=3)
        gal_model.add_gaussian(1.0, mu, basevar + numpy.outer(v, v))

    # add all images to the album
    for i in xrange(num_of_images):
        data = gaussian_filter(illustris_images[i], psf_blur_size)

        # projection parameters
        xi_hat, eta_hat = astrohack_projections.choose_random_projection()
        alpha, beta, gamma = numpy.random.uniform(0.0, 360.0, 3)
        intensity = 150 #20
        scale = 0.18 * numpy.exp(numpy.random.uniform()) #0.5 * numpy.exp(numpy.random.uniform())
        xshift = numpy.random.uniform(13., 16.)#(29.5, 31.)
        yshift = numpy.random.uniform(18., 21.)#(39.5, 41.)
        bg = 0.
        
        image = astrohack_projections.image_and_model()
        image.set_shape((30, 40))
        image.set_psf(psf)
        scale = 0.5
        kwargs = {'alpha':alpha, 'beta':beta, 'gamma':gamma, 'intensity':intensity, 'scale':scale, 'xshift': xshift, 'yshift': yshift, 'bg':0.0}
        image.set_parameters(**kwargs)
        image.set_galaxy(gal_model)
        image.set_ivar(numpy.ones(data.shape))
        image.set_data(data + numpy.random.normal(size=data.shape)/ numpy.sqrt(image.ivar))
        # album
        album.add_image(image)

    return album

def construct_secondary_album(illustris_images, in_album, psf_blur_size=None):
    """
    function constructs the secondary album, now it will contain new Gaussians for the second phase of running
    """
    num_of_images = len(in_album)

    # album and PSF initialisation
    album = astrohack_projections.album_and_model()
    psf = astrohack_projections.mixture_of_gaussians(2)
    psf.add_gaussian(1., numpy.array([0., 0.]), numpy.eye(2)*1.)

    # construct the galaxy using Gaussian mixture
    gal_model = in_album.galaxy
    basevar = 0.5 * numpy.eye(3)
    for i in xrange(2):
        v = numpy.random.uniform(0, 3, size=3)
        mu = numpy.random.uniform(4, 6, size=3) * numpy.random.choice((-1, 1), size=3)
        gal_model.add_gaussian(1.0, mu, basevar + numpy.outer(v, v))

    # add all images to the album
    for i in xrange(num_of_images):
        old_image = in_album.get_all_images()[i]
        if psf_blur_size==None:
            data = illustris_images[i]
        else:
            data = gaussian_filter(illustris_images[i], psf_blur_size)
        
        image = astrohack_projections.image_and_model()
        image.set_shape(old_image.get_shape())
        image.set_psf(psf)
        image.set_parameters_from_vector(old_image.get_parameters_vector())
        image.set_galaxy(gal_model)
        image.set_ivar(old_image.get_ivar())
        image.set_data(data + numpy.random.normal(size=data.shape)/ numpy.sqrt(image.ivar))
        album.add_image(image)

    return album   

def plot_album(album, outfile=None):
    """
    function plots the given album for debugging and/or saving
    """
    album_len = len(album)
    plt.rcParams['figure.figsize'] = 4 * 4, 2 * album_len
    plot_kwargs = {"interpolation": "nearest",
          "cmap": "afmhot",
          "origin": "lower"}

    for i in xrange(len(album)):
        image = album.get_all_images()[i]
        plt.subplot(16, 4, 2*i+1)
        vmin = -5. / numpy.sqrt(numpy.median(image.get_ivar())) # assumes bg = 0
        vmax = -2. * vmin # assumes bg = 0
        plt.imshow(numpy.nan_to_num(numpy.sqrt(image.get_data())), **plot_kwargs)
        plt.colorbar()
        plt.subplot(16, 4, 2*i+2)
        plt.imshow(numpy.nan_to_num(numpy.sqrt(image.get_synthetic())), **plot_kwargs)
        plt.colorbar()

    if outfile != None:
        plt.savefig(outfile)
        plt.close()


def fit_illustris_galaxy_main(log_file, fit_figures_dir):
    """
    function fits to illustris galaxy and saves all relevant data to file
    """
    log = file(log_file, "w")
    log.write("started\n")
    log.flush()

    num_of_images = 32
    psf_blur_size = 2
    illustris_images = construct_illustris_images(num_of_images)

    # phase I
    album = construct_initial_album(illustris_images, psf_blur_size)
    plot_album(album, "%s/phase1_initialisation.pdf" % fit_figures_dir)

    count_run = 0
    chi_reached = False

    while (count_run <= 10) and (not chi_reached): # stoping if did 5 runs or if I reached a sufficient chi square difference
        count_run += 1
        galpar0 = album.get_all_images()[0].galaxy.get_parameters_vector()
        print count_run, len(galpar0)
        log.write("Phase I, run %s, album before %s\n" % (count_run, album(galpar0)))
        log.flush()
        result = op.minimize(album, galpar0, method="Powell")
        galpar = result['x']
        log.write("Phase I, run %s, album after %s\n" % (count_run, album(galpar)))
        log.flush()
        plot_album(album, "%s/phase1_after_album_%s.pdf" % (fit_figures_dir, count_run))

        for image in album:
            imgpar0 = image.get_parameters_vector()
            log.write("Phase I, run %s image before %s\n" % (count_run, image(imgpar0)))
            log.flush()
            result = op.minimize(image, imgpar0)
            imgpar = result['x']
            log.write("Phase I, run %s image after %s\n" % (count_run, image(imgpar)))
            log.flush()
        plot_album(album, "%s/phase1_after_image_%s.pdf" % (fit_figures_dir, count_run))

    # phase II
    album_new = construct_secondary_album(illustris_images, album)
    # initialise
    galpar = album_new.get_all_images()[0].galaxy.get_parameters_vector()
    log.write("Phase II, initialisation, album score: %s\n" % album_new(galpar))
    log.flush()
    for image in album_new:
        imgpar = image.get_parameters_vector()
        log.write("Phase II, initialisation, image score: %s\n" % image(imgpar))
        log.flush()
    plot_album(album_new, "%s/phase2_initialisation.pdf" % fit_figures_dir)

    count_run = 0
    chi_reached = False

    while (count_run <= 10) and (not chi_reached): # stoping if did 5 runs or if I reached a sufficient chi square difference
        count_run += 1
        galpar0 = album_new.get_all_images()[0].galaxy.get_parameters_vector()
        print count_run, len(galpar0)
        log.write("Phase II, run %s, album before %s\n" % (count_run, album_new(galpar0)))
        log.flush()
        result = op.minimize(album_new, galpar0, method="Powell")
        galpar = result['x']
        log.write("Phase II, run %s, album after %s\n" % (count_run, album_new(galpar)))
        log.flush()
        plot_album(album_new, "%s/phase2_after_album_%s.pdf" % (fit_figures_dir, count_run))

        for image in album_new:
            imgpar0 = image.get_parameters_vector()
            log.write("Phase II, run %s image before %s\n" % (count_run, image(imgpar0)))
            log.flush()
            result = op.minimize(image, imgpar0)
            imgpar = result['x']
            log.write("Phase II, run %s image before %s\n" % (count_run, image(imgpar)))
            log.flush()
        plot_album(album_new, "%s/phase2_after_image_%s.pdf" % (fit_figures_dir, count_run))


    # phase III
    album_new = construct_secondary_album(illustris_images, album_new)
    # initialise
    galpar = album_new.get_all_images()[0].galaxy.get_parameters_vector()
    log.write("Phase III, initialisation, album score: %s\n" % album_new(galpar))
    log.flush()
    for image in album_new:
        imgpar = image.get_parameters_vector()
        log.write("Phase III, initialisation, image score: %s\n" % image(imgpar))
        log.flush()
    plot_album(album_new, "%s/phase3_initialisation.pdf" % fit_figures_dir)

    count_run = 0
    chi_reached = False

    while (count_run <= 10) and (not chi_reached): # stoping if did 5 runs or if I reached a sufficient chi square difference
        count_run += 1
        galpar0 = album_new.get_all_images()[0].galaxy.get_parameters_vector()
        print count_run, len(galpar0)
        log.write("Phase III, run %s, album before %s\n" % (count_run, album_new(galpar0)))
        log.flush()
        result = op.minimize(album_new, galpar0, method="Powell")
        galpar = result['x']
        log.write("Phase III, run %s, album after %s\n" % (count_run, album_new(galpar)))
        log.flush()
        plot_album(album_new, "%s/phase3_after_album_%s.pdf" % (fit_figures_dir, count_run))

        for image in album_new:
            imgpar0 = image.get_parameters_vector()
            log.write("Phase III, run %s image before %s\n" % (count_run, image(imgpar0)))
            log.flush()
            result = op.minimize(image, imgpar0)
            imgpar = result['x']
            log.write("Phase III, run %s image before %s\n" % (count_run, image(imgpar)))
            log.flush()
        plot_album(album_new, "%s/phase3_after_image_%s.pdf" % (fit_figures_dir, count_run))
   
