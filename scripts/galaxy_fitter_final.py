import numpy
import astrohack_projections
import matplotlib.pyplot as plt
from scipy.ndimage.filters import gaussian_filter
import scipy.optimize as op
import pickle
import os

class galaxy_fitter(object):

    def __init__(self, illustris_gal_path):
        assert type(illustris_gal_path)==str
        # image production parameters
        self.gal_path = illustris_gal_path
        self.image_parameters = {'num': None,
                                 'shape': None,
                                 'xshift': None,
                                 'yshift': None,
                                 'intensity': None,
                                 'scale': None,
                                 'psf_size': None,
                                 'bg': None}
        self.images_to_fit = []
        # gauss parameters
        self.in_gaus_num = None
        self.iter_gaus_num = None
        # limit parameters
        self.in_iter_limit = None
        self.out_iter_limit = None
        # output
        self.dir_path = None
        self.in_album = None
        self.albums = {}

    def set_image_parameters(self, **kwargs):
        if kwargs is not None:
            for key, value in kwargs.iteritems():
                assert key in self.image_parameters.keys()
                self.image_parameters[key] = value
            self.images_to_fit = []

    def set_initial_gauss_num(self, gaus_num):
        assert type(gaus_num)==int
        self.in_gaus_num = gaus_num

    def set_iter_gauss_num(self, gaus_num):
        assert type(gaus_num)==int
        self.iter_gaus_num = gaus_num

    def set_in_iter_limit(self, limit):
        """
        this is the threshold in percentage to stop the iteration with the current number of Gaussians
        """
        assert numpy.isreal(limit)
        self.in_iter_limit = limit

    def set_out_iter_limit(self, limit):
        """
        this is the threshold in percentage to decide between the current and next number of Gaussians
        """
        assert numpy.isreal(limit)
        self.out_iter_limit = limit

    def set_output_directory(self, dir_path):
        """
        If not None, the fitting class will save its output to the given dir_path
        """
        assert type(dir_path) == str
        self.dir_path = dir_path

    def _construct_images_to_fit(self):
        """
        function constrcts a list of images for the fitting process based on the image parameters
        """
        assert self.gal_path != None
        illustris_gal = astrohack_projections.illustris_model_and_image(self.gal_path)
        illustris_gal.set_image_shape(self.image_parameters['shape'])

        self.images_to_fit = []
        for i in xrange(self.image_parameters['num']):
            xi_hat, eta_hat = astrohack_projections.choose_random_projection()
            alpha, beta, gamma = numpy.random.uniform(0.0, 360.0, 3)
            intensity = self.image_parameters['intensity']
            scale = self.image_parameters['scale'] * numpy.exp(numpy.random.uniform()) 
            xshift = numpy.random.uniform(self.image_parameters['xshift'][0], self.image_parameters['xshift'][1])
            yshift = numpy.random.uniform(self.image_parameters['yshift'][0], self.image_parameters['yshift'][1])
            psf_size = self.image_parameters['psf_size']
            bg = self.image_parameters['bg']
            
            kwargs = {'alpha':alpha, 'beta':beta, 'gamma':gamma, 'intensity':intensity, 'scale':scale, 'xshift': xshift, 'yshift': yshift, 'bg':0.0, 'psf_size':psf_size}
            illustris_gal.set_image_parameters(**kwargs)
            illustris_gal.construct_image()
            self.images_to_fit.append(illustris_gal.get_image())

    def _construct_initial_album(self):
        """
        construct the initial album with which the fitting begins,
        the album is constrcuted based on the same image parameters 
        """
        assert len(self.images_to_fit) > 0
        assert self.in_gaus_num != None

        # album and PSF initialisation
        album = astrohack_projections.album_and_model()
        psf = astrohack_projections.mixture_of_gaussians(2)
        psf.add_gaussian(1., numpy.array([0., 0.]), numpy.eye(2)*1.)

        # construct the galaxy using Gaussian mixture
        basevar = 0.5 * numpy.eye(3)
        gal_model = astrohack_projections.galaxy_model_3d()
        for i in xrange(self.in_gaus_num):
            v = numpy.random.uniform(0, 3, size=3)
            mu = numpy.random.uniform(-3, 3, size=3)
            gal_model.add_gaussian(1.0, mu, basevar + numpy.outer(v, v))

        # add all images to the album
        for i in xrange(self.image_parameters['num']):
            data = self.images_to_fit[i]

            # projection parameters
            xi_hat, eta_hat = astrohack_projections.choose_random_projection()
            alpha, beta, gamma = numpy.random.uniform(0.0, 360.0, 3)
            intensity = self.image_parameters['intensity']

            scale = self.image_parameters['scale'] * numpy.exp(numpy.random.uniform())
            if scale < 0.5:
                scale = 0.5
            xshift = numpy.random.uniform(self.image_parameters['xshift'][0], self.image_parameters['xshift'][1])
            yshift = numpy.random.uniform(self.image_parameters['yshift'][0], self.image_parameters['yshift'][1])
            bg = self.image_parameters['bg']
            
            image = astrohack_projections.image_and_model()
            image.set_shape(self.image_parameters['shape'])
            image.set_psf(psf)
            kwargs = {'alpha':alpha, 'beta':beta, 'gamma':gamma, 'intensity':intensity, 'scale':scale, 'xshift': xshift, 'yshift': yshift, 'bg':0.0}
            image.set_parameters(**kwargs)
            image.set_galaxy(gal_model)
            image.set_ivar(numpy.ones(data.shape))
            image.set_data(data + numpy.random.normal(size=data.shape)/ numpy.sqrt(image.ivar))
            # album
            album.add_image(image)
        album.set_galaxy(gal_model)
        self.albums[len(album.galaxy.alphas)] = album
        self.in_album = album

    def _construct_secondary_album(self, in_album):
        """
        function constructs the secondary album, now it will contain new Gaussians for the second phase of running
        """
        assert self.in_album != None

        # album and PSF initialisation
        album = astrohack_projections.album_and_model()
        psf = astrohack_projections.mixture_of_gaussians(2)
        psf.add_gaussian(1., numpy.array([0., 0.]), numpy.eye(2)*1.)

        # construct the galaxy using Gaussian mixture
        gal_model = self.in_album.galaxy
        basevar = 0.5 * numpy.eye(3)
        for i in xrange(self.iter_gaus_num):
            v = numpy.random.uniform(0, 10, size=3)
            mu = numpy.random.uniform(-3, 3, size=3)
            gal_model.add_gaussian(1.0, mu, basevar + numpy.outer(v, v))

        # add all images to the album
        for i in xrange(self.image_parameters['num']):
            old_image = self.in_album.get_all_images()[i]
            data = old_image.get_data()
            
            image = astrohack_projections.image_and_model()
            image.set_shape(old_image.get_shape())
            image.set_psf(psf)
            image.set_parameters_from_vector(old_image.get_parameters_vector())
            image.set_galaxy(gal_model)
            image.set_ivar(old_image.get_ivar())
            image.set_data(data)
            album.add_image(image)
        album.set_galaxy(gal_model)
        self.albums[len(album.galaxy.alphas)] = album
        return album

    def _plot_album(self, album, album_path):
        """
        function plots the given album for debugging and/or saving
        """
        assert type(album_path) == str
        assert self.dir_path != None

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


        plt.savefig(album_path)
        plt.close()

    def _pickle_album(self, album, album_path):
        f = open(album_path, "wb")
        pickle.dump(album, f)
        f.close()

    def _minimise_parameters_of_given_album(self, album):
        """
        function minimises the parameters of the given album - one for galpar and one for imgpar 
        """
        # minimise galaxy parameters
        galpar0 = album.get_all_images()[0].galaxy.get_parameters_vector()
        gaus_num = len(galpar0) / 10
        result = op.minimize(album, galpar0, method='Powell')
        galpar = result['x']
        self.iter_num += 1
        likelihood_in_album = album(galpar)
        self.f_likelihood.write("Gauss num:%s, iter num:%s, after album likelihood:%s\n" % (gaus_num, self.iter_num, likelihood_in_album))
        self.f_likelihood.flush()
        self._plot_album(album, "%s/gauss_%s_iter_%s_after_album.pdf" % (self.image_dir, str(gaus_num).zfill(3), str(self.iter_num).zfill(3)))

        # minimise image parameters
        for image in album:
            imgpar0 = image.get_parameters_vector()
            result = op.minimize(image, imgpar0)
            imgpar = result['x']
            likelihood_in_image = image(imgpar)
        likelihood_in_images = album(galpar)
        self.iter_num += 1
        self.f_likelihood.write("Gauss num:%s, iter num:%s, after image likelihood:%s\n" % (gaus_num, self.iter_num, likelihood_in_images))
        self.f_likelihood.flush()
        self._plot_album(album, "%s/gauss_%s_iter_%s_after_images.pdf" % (self.image_dir, str(gaus_num).zfill(3), str(self.iter_num).zfill(3)))

        return likelihood_in_images, album 
        

    def fit_galaxy(self, save_likelihood=True, save_fit_images=True, save_albums=True):
        """
        function performs the iterative fit to the galaxy that was specified in the class
        one can decide how much of the data the function will save every iteration
        """
        assert self.in_gaus_num != None
        assert self.iter_gaus_num != None
        assert self.in_iter_limit != None
        assert self.out_iter_limit != None

        # saving all the needed output
        if save_likelihood or save_fit_images or save_albums:
            assert self.dir_path != None
            assert os.path.isdir(self.dir_path)

        if save_likelihood:
            self.f_likelihood = file("%s/likelihood_values.txt" % self.dir_path, "w")

        if save_fit_images:
            self.image_dir = "%s/fit_images/" % self.dir_path
            if not os.path.isdir(self.image_dir):
                os.mkdir(self.image_dir)


        if save_albums:
            self.albums_dir = "%s/albums/" % self.dir_path
            if not os.path.isdir(self.albums_dir):
                os.mkdir(self.albums_dir)

        self.f_likelihood.write("started\n")
        self.f_likelihood.flush()

        # make sure I have all the parameters I need for the images
        for value in self.image_parameters.values():
            assert value != None
        # produce the images I need
        self._construct_images_to_fit()
        assert len(self.images_to_fit) > 0

        # construct the initial album
        self._construct_initial_album()
        assert len(self.albums.keys()) > 0
        assert self.in_album != None and type(self.in_album) == astrohack_projections.album_and_model
        assert len(self.in_album) == len(self.images_to_fit)
        # save initial album image and pickle
        self._plot_album(self.in_album, "%s/album_00_initialisation.pdf" % self.image_dir)
        self._pickle_album(self.in_album, "%s/album_00_initialisation" % self.albums_dir)


        stop_out_iter = False
        prev_album = self.in_album
        self.iter_num = 0

        galpar = prev_album.get_all_images()[0].galaxy.get_parameters_vector()
        gaus_num = len(galpar) / 10
        likelihood_in_prev_opt = prev_album(galpar)
        self.f_likelihood.write("Gauss num:%s, iter num:%s, likelihood:%s\n" % (gaus_num, self.iter_num, likelihood_in_prev_opt))
        self.f_likelihood.flush()

        likelihood_in_prev_album = 10 ** 8 # just a big number to pass the first while

        while not stop_out_iter:
            stop_in_iter = False
            self.iter_num = 0
            while not stop_in_iter:
                likelihood_in_current_opt, current_album = self._minimise_parameters_of_given_album(prev_album)
                improvment = ((likelihood_in_prev_opt - likelihood_in_current_opt) / likelihood_in_current_opt) * 100.0
                
                if improvment <= self.in_iter_limit:
                    stop_in_iter = True
                else:
                    prev_album = current_album
                    likelihood_in_prev_opt = likelihood_in_current_opt

            # save the best result I found
            galpar = current_album.get_all_images()[0].galaxy.get_parameters_vector()
            gaus_num = len(galpar) / 10
            self._pickle_album(current_album, "%s/album_%s_gaussians" % (self.albums_dir, gaus_num))
            likelihood_in_current_album = likelihood_in_current_opt

            # check if I need to continue to the next Gaussian number
            improvment = ((likelihood_in_prev_album - likelihood_in_current_album) / likelihood_in_prev_album) * 100.0
            if improvment > self.out_iter_limit:
                prev_album = self._construct_secondary_album(current_album)
                likelihood_in_prev_album = likelihood_in_current_album
            else:
                stop_out_iter = True

        self.f_likelihood.write("done\n")
        self.f_likelihood.flush()
        self.f_likelihood.close()

 
        
def main_galaxy_83():
    """
    function is the main function for the minimisation code for the 83 galaxy from illustris
    """
    gal_path = "/Users/dalyabaron/Copy/Astrophysics/python/new_scripts/new_scripts/DeprojectAllGalaxies/illustris_galaxies/cutout_83.hdf5"
    gfitter = galaxy_fitter(gal_path)

    image_parameters = {'num': 32,
                        'shape': (30, 40),
                        'xshift': (13., 16.),
                        'yshift': (18., 21.),
                        'intensity': 150,
                        'scale': 0.18,
                        'psf_size': 1,
                        'bg': 0}
    gfitter.set_image_parameters(**image_parameters)
    gfitter.set_initial_gauss_num(1)#3)
    gfitter.set_iter_gauss_num(1)#2)
    gfitter.set_in_iter_limit(0.1)
    gfitter.set_out_iter_limit(0.1) #0.1
    gfitter.set_output_directory("/Users/dalyabaron/Copy/Astrophysics/python/new_scripts/new_scripts/DeprojectAllGalaxies/fitting_pngs/galaxy_fitter_code_83_simp")

    gfitter.fit_galaxy()

def main_galaxy_242959():
    """
    function is the main function for the minimisation code for the 83 galaxy from illustris
    """
    gal_path = "/Users/dalyabaron/Downloads/cutout_242959.hdf5"
    gfitter = galaxy_fitter(gal_path)

    image_parameters = {'num': 32,
                        'shape': (60, 80),
                        'xshift': (29., 31.),
                        'yshift': (39., 41.),
                        'intensity': 20,
                        'scale': 0.015,
                        'psf_size': 1.5,
                        'bg': 0}
    gfitter.set_image_parameters(**image_parameters)
    gfitter.set_initial_gauss_num(3)
    gfitter.set_iter_gauss_num(2)
    gfitter.set_in_iter_limit(1)
    gfitter.set_out_iter_limit(0.1) #0.1
    gfitter.set_output_directory("/Users/dalyabaron/Copy/Astrophysics/python/new_scripts/new_scripts/DeprojectAllGalaxies/fit_products/galaxy_fitter_code_242959_2")

    gfitter.fit_galaxy()

