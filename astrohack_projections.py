"""
This file is part of the DeprojectAllGalaxies project.
Copyright 2015 Dalya Baron and David W. Hogg.
"""

import numpy
import numpy as np
import scipy.stats
from scipy.stats import multivariate_normal
from scipy.linalg import orth
import matplotlib.pyplot as plt
from math import pi ,sin, cos

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
		new.alphas = [a for a in self.alphas] # cheating
		new.mus = [m for m in self.mus]
		new.fis = [f for f in self.fis]
		new.K = self.K
		return new

	def __mul__(self, factor):
		new = self.copy()
		for k, alpha in enumerate(self.alphas):
			new.alphas[k] = alpha * factor
		return new

	def add_gaussian(self, alpha, mu, fi):

		assert mu.shape == (self.D,)
		assert fi.shape == (self.D, self.D)

		self.alphas.append(alpha)
		self.mus.append(mu)
		self.fis.append(fi)
		self.K += 1

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


class galaxy_model_3d(object):
	"""
	the class represents a 3D dimensional galaxy model which is constructed from Gaussians
	"""
	def __init__(self):
		self.mixture = mixture_of_gaussians(3)

	def copy(self):
		new = galaxy_model_3d()
		new.mixture = self.mixture.copy()
		return new

	def __mul__(self, factor):
		new = self.copy()
		new.mixture *= factor
		return new # risky!

	def add_gaussian(self, alpha, mu, fi):
		self.mixture.add_gaussian(alpha, mu, fi)

	def get_total_mass(self):
		return self.mixture.get_total_mass()

	def project_2d(self, xi_hat, eta_hat):
		assert xi_hat.shape == (self.mixture.D,)
		assert eta_hat.shape == (self.mixture.D,)
		assert numpy.isclose(numpy.dot(xi_hat, xi_hat), 1.0) 
		assert numpy.isclose(numpy.dot(eta_hat, eta_hat), 1.0) 
		assert numpy.isclose(numpy.dot(xi_hat, eta_hat), 0.0)

		projection_matrix = numpy.vstack((xi_hat, eta_hat))
		mixture_2d = mixture_of_gaussians(2)
		for k in range(self.mixture.K):
			m = numpy.dot(projection_matrix, self.mixture.mus[k])
			V = numpy.dot(numpy.dot(projection_matrix, self.mixture.fis[k]), projection_matrix.T)
			mixture_2d.add_gaussian(self.mixture.alphas[k], m, V)
		return mixture_2d

	def render_2d_image(self, xi_hat, eta_hat, xs, ys):
		Y, X = numpy.meshgrid(ys, xs)
		xs_flatten = X.flatten()
		ys_flatten = Y.flatten()
		positions_flatten = numpy.vstack((xs_flatten, ys_flatten)).T

		mixture_2d = self.project_2d(xi_hat, eta_hat)
		densities_flatten = mixture_2d.render(positions_flatten)
		densities = numpy.reshape(densities_flatten, X.shape)
		return densities

	def plot_3d_image(self, xs, ys, zs):
		"""
		function plots the 3d Gassian model
		"""
		pass

	def plot_2d_image(self, ax, xi_hat, eta_hat, xs, ys):
		"""
		function plots the projected 2D Gaussian model
		"""
		densities = self.render_2d_image(xi_hat, eta_hat, xs, ys)
		X, Y = numpy.meshgrid(xs, ys)
		ax.pcolormesh(X, Y, densities)
		return ax

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

class astronomical_image(object):
	"""
	An object class for astronomical images and functions to make and analyze them.
	"""
	
	def __init__(self):
		"""
		Trivial.
		"""
		self.data = None
		self.synthetic = None
		self.ivar = None
		self.shape = None
		self.noise_added = False
	
	def set_data(self, data):
		"""
		Set the image pixel data (the image itself).
		"""
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
		if self.data is not None and self.data.shape != self.shape:
			self.data = None
		if self.ivar is not None and self.ivar.shape != self.shape:
			self.ivar = None
		if self.synthetic is not None and self.synthetic.shape != self.shape:
			self.synthetic = None
	
	def get_data(self):
		return self.data

	def get_synthetic(self):
		return self.synthetic

	def get_shape(self):
		return self.shape

	def add_random_noise(self):
		"""
		Add in Gaussian noise with inverse variance set by `self.ivar`.
		"""
		assert self.ivar is not None
		sigma = numpy.zeros(self.shape)
		good = (self.ivar > 0.)
		sigma[good] = 1. / np.sqrt(self.ivar[good])
		if self.synthetic is None:
			self.synthetic = 0.
		self.synthetic += sigma * np.random.normal(size=self.shape)
		self.noise_added = True
	
	def add_background_level(self, bg):
		"""
		Add a constant level into the image data.
		"""
		if self.synthetic is None:
			self.synthetic = 0.
		self.synthetic += bg
	
	def add_galaxy(self, galaxy, xi_hat, eta_hat, scale, xshift, yshift, psf=None):
		"""
		Add a projected 3d galaxy into the image.

		- `scale`: kpc per pixel
		- `xshift`: location of x=0, y=0 within the image in pixel coords

		"""
		nx, ny = self.shape
		xs = (numpy.arange(nx) - xshift) * scale # kpc
		ys = (numpy.arange(ny) - yshift) * scale # kpc
		if self.synthetic is None:
			self.synthetic = 0.
		self.synthetic += galaxy.render_2d_image(xi_hat, eta_hat, xs, ys)

	def ln_likelihood(self):
		"""
		Compare synthetic and data images.
		"""
		assert not self.noise_added
		return -0.5 * numpy.sum(self.ivar * (self.data - self.synthetic) ** 2)
