import numpy
import scipy.stats
from scipy.stats import multivariate_normal
from scipy.linalg import orth
import matplotlib.pyplot as plt

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

	def add_gaussian(self, alpha, mu, fi):
		assert type(alpha) == float
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



class galaxy_model_3d(object):
	"""
	the class represents a 3D dimensional galaxy model which is constructed from Gaussians
	"""

	def __init__(self):
		self.mixture = mixture_of_gaussians(3)

	def add_gaussian(self, alpha, mu, fi):
		self.mixture.add_gaussian(alpha, mu, fi)

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
		X, Y = numpy.meshgrid(xs, ys)
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



