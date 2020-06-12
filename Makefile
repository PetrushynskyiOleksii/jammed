lint:
	pylint --rcfile=.pylintrc ./collector/app/ --init-hook='sys.path.extend(["./collector/"])';\
    pylint --rcfile=.pylintrc ./server/app/ --init-hook='sys.path.extend(["./server/"])'