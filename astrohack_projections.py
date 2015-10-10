"""
This file is part of the DeprojectAllGalaxies project.
Copyright 2015 Dalya Baron and David W. Hogg.
"""

import numpy
import scipy.stats
from scipy.stats import multivariate_normal
from scipy.linalg import orth
import matplotlib.pyplot as plt
from math import pi ,sin, cos
import h5py
from scipy.ndimage.filters import gaussian_filter

class rotation_3d(object):
	"""
	the class allows one to rotate a 3D vector in different directions
	"""
	def __init__(self):
		self.rot_mat_x = numpy.eye(3)
		self.rot_mat_y = numpy.eye(3)
		self.rot_mat_z = numpy.eye(3)

	def _calc_rotation_matrix_x(self, theta, units='deg'):
		assert units=='deg' or units=='rad'

		if units=='deg':
			theta_rad = theta * pi / 180.0
		self.rot_mat_x = numpy.array((1, 0, 0, 0, cos(theta_rad), -sin(theta_rad), 0, sin(theta_rad), cos(theta_rad))).reshape((3, 3))

	def _calc_rotation_matrix_y(self, theta, units='deg'):
		assert units=='deg' or units=='rad'
		
		if units=='deg':
			theta_rad = theta * pi / 180.0
		self.rot_mat_y = numpy.array((cos(theta_rad), 0, sin(theta_rad), 0, 1, 0, -sin(theta_rad), 0, cos(theta_rad))).reshape((3, 3))

	def _calc_rotation_matrix_z(self, theta, units='deg'):
		assert units=='deg' or units=='rad'
		
		if units=='deg':
			theta_rad = theta * pi / 180.0
		self.rot_mat_z = numpy.array((cos(theta_rad), -sin(theta_rad), 0, sin(theta_rad), cos(theta_rad), 0, 0, 0, 1)).reshape((3, 3))

	def _calc_rotation_matrix(self):
		self.rot_mat = numpy.dot(numpy.dot(self.rot_mat_x, self.rot_mat_y), self.rot_mat_z)

	def return_rotation_matrix(self, theta_x, theta_y, theta_z, units='deg'):
		"""
		function rotates a vector in 3D with three given angles
		"""
		assert units=='deg' or units=='rad'

		self._calc_rotation_matrix_x(theta_x, units)
		self._calc_rotation_matrix_y(theta_y, units)
		self._calc_rotation_matrix_z(theta_z, units)
		self._calc_rotation_matrix()

		return self.rot_mat

	def rotate_vector(self, theta_x, theta_y, theta_z, vector, units='deg'):
		"""
		function rotates a vector in 3D with three given angles
		"""
		assert units=='deg' or units=='rad'
		assert vector.shape == (3, )

		self._calc_rotation_matrix_x(theta_x, units)
		self._calc_rotation_matrix_y(theta_y, units)
		self._calc_rotation_matrix_z(theta_z, units)
		self._calc_rotation_matrix()

		return numpy.dot(vector, self.rot_mat)

class mixture_of_gaussians(object):
	"""
	the class represents a D dimensional galaxy model which is constructed from Gaussians
	"""
	def __init__(self, D):
		self.alphas = []
		self.mus = []
		self.fis = []
		self.K = 0
		self.D = D

	def copy(self):
		"""
		This code is brittle because we are not using proper setters (or adders) to construct the mixture.
		"""
		new = mixture_of_gaussians(self.D)
		for alpha, mu, fi in zip(self.alphas, self.mus, self.fis):
			new.add_gaussian(alpha, mu.copy(), fi.copy())
		return new

	def __mul__(self, factor):
		new = self.copy()
		for k, alpha in enumerate(self.alphas):
			new.alphas[k] = alpha * factor
		return new

	def rescale(self, scale):
		"""
		Expand everything by isotropic scale.
		Hacky and brittle!
		Returns a copy!
		"""
		new = self.copy()
		new.mus = [scale * mu for mu in self.mus]
		new.fis = [scale * scale * fi for fi in self.fis]
		return new

	def add_gaussian(self, alpha, mu, fi):

		assert mu.shape == (self.D,)
		assert fi.shape == (self.D, self.D)

		self.alphas.append(alpha)
		self.mus.append(mu)
		self.fis.append(fi)
		self.K += 1

	def convolve(self, other):
		"""
		Convolve a mixture with another mixture.
		Might really be *correlate* rather than convolve!
		Returns a new object; doesn't work in place.
		"""
		assert self.D == other.D
		new = mixture_of_gaussians(self.D)
		for ks in range(self.K):
			for ko in range(other.K):
				new.add_gaussian(self.alphas[ks] * other.alphas[ko],
								 self.mus[ks] + other.mus[ko],
								 self.fis[ks] + other.fis[ko])
		return new

	def render(self, positions):
		N, D = positions.shape
		assert D == self.D

		densities= numpy.zeros(N)
		for k in range(self.K):
			gaus_k = multivariate_normal(mean=self.mus[k], cov=self.fis[k])
			pdf_k = gaus_k.pdf(positions)
			densities += self.alphas[k] * pdf_k
		return densities

	def get_total_mass(self):
		return numpy.sum(self.alphas)


class galaxy_model_3d(mixture_of_gaussians):
	"""
	the class represents a 3D dimensional galaxy model which is constructed from Gaussians
	"""
	def __init__(self):
		super(galaxy_model_3d, self).__init__(3)

	def copy(self):
		"""
		This code is brittle because we are not using proper setters (or adders) to construct the mixture.
		"""
		new = galaxy_model_3d()
		for alpha, mu, fi in zip(self.alphas, self.mus, self.fis):
			new.add_gaussian(alpha, mu.copy(), fi.copy())
		return new

	def project_2d(self, xi_hat, eta_hat):
		assert xi_hat.shape == (self.D,)
		assert eta_hat.shape == (self.D,)
		assert numpy.isclose(numpy.dot(xi_hat, xi_hat), 1.0) 
		assert numpy.isclose(numpy.dot(eta_hat, eta_hat), 1.0) 
		assert numpy.isclose(numpy.dot(xi_hat, eta_hat), 0.0)

		projection_matrix = numpy.vstack((xi_hat, eta_hat))
		mixture_2d = mixture_of_gaussians(2)
		for k in range(self.K):
			m = numpy.dot(projection_matrix, self.mus[k])
			V = numpy.dot(numpy.dot(projection_matrix, self.fis[k]), projection_matrix.T)
			mixture_2d.add_gaussian(self.alphas[k], m, V)
		return mixture_2d

	def render_2d_image(self, xi_hat, eta_hat, xs, ys, intensity=1., psf=None):
		Y, X = numpy.meshgrid(ys, xs)
		xs_flatten = X.flatten()
		ys_flatten = Y.flatten()
		positions_flatten = numpy.vstack((xs_flatten, ys_flatten)).T
		mixture_2d = self.project_2d(xi_hat, eta_hat) * intensity
		if psf is not None:
			mixture_2d = mixture_2d.convolve(psf)
		densities_flatten = mixture_2d.render(positions_flatten)
		densities = numpy.reshape(densities_flatten, X.shape)
		return densities
	
	def set_parameters_from_vector(self, vector):
		assert len(vector) % 10 == 0
		self.__init__()
		for i in xrange(0, len(vector), 10):
			parameters = vector[i:i+10]
			alpha = parameters[0]
			mu = parameters[1:4]
			fi = numpy.zeros((3,3))
			fi[numpy.diag_indices(3)] = parameters[4:7]
			fi[numpy.triu_indices(3, 1)] += parameters[7:10]
			fi[numpy.tril_indices(3, -1)] += parameters[7:10]
			self.add_gaussian(alpha, mu, fi)

	def get_parameters_vector(self):
		vector = numpy.zeros(10 * self.K)
		for k in range(self.K):
			i = 10 * k
			vector[i] = self.alphas[k]
			vector[i+1:i+4] = self.mus[k]
			vector[i+4:i+7] = (self.fis[k])[numpy.diag_indices(3)]
			vector[i+7:i+10] = (self.fis[k])[numpy.triu_indices(3, 1)]
		return vector

	def get_ln_prior(self):
		"""
		Penalize bad (or impossible) condition numbers.
		"""
		lnp = 0.
		for fi in self.fis:
			try:
				eigs = numpy.linalg.eigvalsh(fi)
			except:
				print "eigs did not converge"
				return -numpy.Inf
			if numpy.any(eigs <= 0.):
				return -numpy.Inf
			lnp -= numpy.log(numpy.max(eigs) / numpy.min(eigs)) # condition number!
		return lnp


def choose_random_projection():
	"""
	Generate two orthogonal normal vectors, drawn isotropically from the sphere.
	"""
	xhat = numpy.random.normal(size=3)
	xhat /= numpy.sqrt(numpy.dot(xhat, xhat))
	yhat = numpy.random.normal(size=3)
	yhat -= numpy.dot(xhat, yhat) * xhat
	yhat /= numpy.sqrt(numpy.dot(yhat, yhat))
	return xhat, yhat


class image_and_model(object):
	"""
	This class represents a 2D image of a galaxy and holds all the parameters that convert the 3D model to this
	"""
	def __init__(self):
		self.data = None
		self.synthetic = 0.
		self.ivar = None
		self.shape = None
		self.psf = None

		self.parameters = {'alpha' : None,
						   'beta' : None,
						   'gamma' : None,
						   'intensity' : None,
						   'scale' : None,
						   'xshift' : None,
						   'yshift' : None,
						   'bg' : None}

	def set_data(self, data):
		if self.shape is None:
			self.shape = data.shape
		else:
			assert data.shape == self.shape
		self.data = data

	def set_ivar(self, ivar):
		"""
		Set the estimated inverse variance map for the image.
		"""
		if self.shape is None:
			self.shape = ivar.shape
		else:
			assert ivar.shape == self.shape
		self.ivar = ivar

	def set_shape(self, shape):
		assert len(shape) == 2
		self.shape = shape
		self.synthetic = 0.
		return None

	def set_psf(self, psf):
		assert type(psf) == mixture_of_gaussians
		assert psf.D == 2
		self.psf = psf
		self.synthetic = 0.

	def set_parameters(self, **kwargs):
		if kwargs is not None:
			for key, value in kwargs.iteritems():
				assert key in self.parameters.keys()
				self.parameters[key] = value
			self.synthetic = 0.

	def set_parameters_from_vector(self, par_vector):
		self.parameters['alpha'] = par_vector[0]
		self.parameters['beta'] = par_vector[1]
		self.parameters['gamma'] = par_vector[2]
		self.parameters['intensity'] = par_vector[3]
		self.parameters['scale'] = par_vector[4]
		self.parameters['xshift'] = par_vector[5]
		self.parameters['yshift'] = par_vector[6]
		self.parameters['bg'] = par_vector[7]
		self.synthetic = 0.

	def set_galaxy(self, galaxy):
		assert type(galaxy) == galaxy_model_3d
		self.galaxy = galaxy
		self.synthetic = 0.

	def get_data(self):
		return self.data

	def get_ivar(self):
		return self.ivar

	def get_synthetic(self):
		if numpy.isscalar(self.synthetic):
			if self.synthetic != 0.0:
				self.synthetic = 0
			self.construct_synthetic()
		return self.synthetic

	def get_shape(self):
		return self.shape

	def get_parameters(self):
		return self.parameters

	def get_parameters_vector(self):
		return numpy.array((self.parameters['alpha'],
							self.parameters['beta'],
							self.parameters['gamma'],
							self.parameters['intensity'],
							self.parameters['scale'],
							self.parameters['xshift'],
							self.parameters['yshift'],
							self.parameters['bg']))

	def get_parameter(self, key):
		assert key in self.parameters.keys()
		return self.parameters[key]

	def _add_to_synthetic(self, contribution):
		self.synthetic += contribution

	def construct_synthetic(self):

		nx, ny = self.shape
		xs = (numpy.arange(nx) - self.parameters['xshift']) * self.parameters['scale'] # kpc
		ys = (numpy.arange(ny) - self.parameters['yshift']) * self.parameters['scale'] # kpc

		r = rotation_3d()
		r_mat = r.return_rotation_matrix(self.parameters['alpha'], self.parameters['beta'], self.parameters['gamma'])
		xi_hat = r_mat[0]
		eta_hat = r_mat[1]

		self._add_to_synthetic(self.parameters['bg'])
		self._add_to_synthetic(self.galaxy.render_2d_image(xi_hat, eta_hat, xs, ys,
				               intensity=self.parameters['intensity'],
				               psf=self.psf.rescale(self.parameters['scale'])))

	def get_chi_squared(self):
		return numpy.sum(self.ivar * (self.data - self.get_synthetic()) ** 2)

	def get_chi_vector(self):
		return (numpy.sqrt(self.ivar) * (self.data - self.get_synthetic())).flatten()

	def get_ln_likelihood(self):
		return -0.5 * self.get_chi_squared()
		
	def get_ln_prior(self):
		return 0. # no beliefs

	def __call__(self, parameter_vector):
		self.set_parameters_from_vector(parameter_vector)
		return self.get_chi_squared()


class album_and_model(object):
	"""
	This class represents a set of images that come from the same 3D model with different parameters
	"""
	def __init__(self):
		self.images = []
		self.galaxy = None

	def __len__(self):
		return len(self.images)

	def __getitem__(self, i):
		return self.images[i]

	def __iter__(self):
		for image in self.images:
			yield image

	def add_image(self, image):
		assert type(image) == image_and_model
		self.images.append(image)

	def get_all_images(self):
		return self.images
	
	def set_galaxy(self, galaxy):
		self.galaxy = galaxy
		for image in self.images:
			image.set_galaxy(galaxy)
	
	def get_chi_squared(self):
		chisquared = 0.
		for image in self.images:
			chisquared += image.get_chisquared()
		return chisquared
		
	def get_ln_likelihood(self):
		lnlike = 0.
		for image in self.images:
			lnlike += image.get_ln_likelihood()
		return lnlike
		
	def get_ln_prior(self):
		lnp = self.galaxy.get_ln_prior()
		for image in self.images:
			lnp += image.get_ln_prior()
		return lnp
	
	def get_ln_posterior(self):
		lnp = self.get_ln_prior()
		if numpy.isfinite(lnp):
			lnp += self.get_ln_likelihood()
		return lnp

	def __call__(self, galparvec):
		"""
		Return -2 * ln_prob, which is something we can *minimize*.
		"""
		galaxy = galaxy_model_3d()
		galaxy.set_parameters_from_vector(galparvec)
		self.set_galaxy(galaxy) # must use `set_galaxy()` to propagate to images
		return -2. * self.get_ln_posterior()


class illustris_model_and_image(object):

	def __init__(self, file_path):
		assert h5py.is_hdf5(file_path)

		self.file_path = file_path

		f = h5py.File(file_path, "r")
		stars_snap = f['PartType4']
		stars_coords = stars_snap['Coordinates']
		stars_mags = stars_snap['GFM_StellarPhotometrics']

		self.stars_coords = (stars_coords - numpy.mean(stars_coords, axis=0)) / numpy.std(stars_coords, axis=0)
		self.stars_mags = {'U': stars_mags[:,0],
						   'B': stars_mags[:,1],
						   'V': stars_mags[:,2],
						   'K': stars_mags[:,3],
						   'g': stars_mags[:,4],
						   'r': stars_mags[:,5],
						   'i': stars_mags[:,6],
						   'z': stars_mags[:,7]}
		self.image = 0.
		self.image_parameters = {'alpha' : None,
						   		 'beta' : None,
						   		 'gamma' : None,
						   		 'intensity' : None,
						   		 'scale' : None,
						   		 'xshift' : None,
						   		 'yshift' : None,
						   		 'bg' : None,
						   		 'psf_size': None}

	def set_image_shape(self, shape):
		assert len(shape) == 2
		self.shape = shape

	def set_image_parameters(self, **kwargs):
		if kwargs is not None:
			for key, value in kwargs.iteritems():
				assert key in self.image_parameters.keys()
				self.image_parameters[key] = value
			self.image = 0.

	def get_image(self):
		return self.image


	def _add_to_image(self, contribution):
		self.image += contribution

	def render_2d_image(self, xi_hat, eta_hat, xs, ys, band_mag='g'):
		projection_matrix = numpy.vstack((xi_hat, eta_hat))
		stars_coords_2d = numpy.dot(self.stars_coords, projection_matrix.T)
		H, xedges, yedges = numpy.histogram2d(stars_coords_2d[:,0], 
											  stars_coords_2d[:,1], 
											  [xs, ys], 
											  normed=True, 
											  weights= 10 ** (self.stars_mags[band_mag]/-2.5))

		return H

	def construct_image(self):

		nx, ny = self.shape
		xs = (numpy.arange(nx + 1) - self.image_parameters['xshift']) * self.image_parameters['scale'] # kpc
		ys = (numpy.arange(ny + 1) - self.image_parameters['yshift']) * self.image_parameters['scale'] # kpc

		r = rotation_3d()
		r_mat = r.return_rotation_matrix(self.image_parameters['alpha'], self.image_parameters['beta'], self.image_parameters['gamma'])
		xi_hat = r_mat[0]
		eta_hat = r_mat[1]

		H = self.render_2d_image(xi_hat, eta_hat, xs, ys)
		if self.image_parameters['psf_size'] != None:
			H = gaussian_filter(H, self.image_parameters['psf_size'])

		if self.image_parameters['bg'] != None:
			self._add_to_image(self.image_parameters['bg'])

		self._add_to_image(H * self.image_parameters['intensity'])
	


