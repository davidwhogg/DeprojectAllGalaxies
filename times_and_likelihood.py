# this is a temporary python file that will help me to understand the likelhood and times of the minimisation

import numpy

def return_likelihood_list(path):
	"""
	the function returns the log-likelihood of the given file,
	the function does not check before/after and does not do anything smart with all the images
	other functions will do this
	"""
	f = file(path, "r")
	lines = f.read().splitlines()
	like_list = []
	like_album_list = []
	like_image_list = []
	for line in lines:
		like_list.append(float(line.split(" ")[-1]))
		if "album" in line:
			like_album_list.append(float(line.split(" ")[-1]))
		if "image" in line:
			like_image_list.append(float(line.split(" ")[-1]))

	like_list = numpy.array(like_list)
	like_album_list = numpy.array(like_album_list)
	like_image_list = numpy.array(like_image_list)

	return like_list, like_album_list, like_image_list


def return_likelihood_per_iter(path):
	"""
	the function returns the likelhood after aggregation per iteration
	it returns two lists of before and after in order to plot them in different color
	"""
	f = file(path, "r")
	lines = f.read().splitlines()

	iter_num = []
	album_before = []
	album_after = []

	iter_val = 0
	for line in lines:
		if "album before" in line:
			iter_val += 1
			album_before.append(float(line.split(" ")[-1]))
			iter_num.append(iter_val)
		elif "album after" in line:
			album_after.append(float(line.split(" ")[-1]))
			

	iter_num = numpy.array(iter_num)
	album_before = numpy.array(album_before)
	album_after = numpy.array(album_after)

	return iter_num, album_before, album_after


