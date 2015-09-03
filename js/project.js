var Accordion = function() {
    this.bindContexts();
};

Accordion.prototype = {

    addEventListeners: function() {
        document.addEventListener('click', this.bindedOnClick, false);
        document.addEventListener('transitionend', this.bindedTransitionEnd, false);
    },

    bindContexts: function() {
        this.bindedOnClick = this.onClick.bind(this);
        this.bindedTransitionEnd = this.transitionEnd.bind(this);
    },

    onClick: function(event) {
        var _this = this;
        if (event && event.target) {
            var element = _this.getDataParameter(event.target, 'accordion_title');
            if (element && element.dataset && element.dataset.accordion_layer) {
                if (element.dataset.accordion_layer === '1') {
                    _this.getElementsLayer('2');
                    _this.bodyElements.forEach(function(body) {
                        if (!body.classList.contains('hide')) {
                            _this.collapseAndHide(body);
                        }
                    });
                }
                _this.getElementsLayer(element.dataset.accordion_layer);
                _this.pointerElements.forEach(function(pointer) {
                    if (pointer.classList.contains('rotate-90')) {
                        pointer.classList.remove('rotate-90')
                    }
                });
                _this.bodyElements.forEach(function(body) {
                    if (element.dataset.accordion_title === body.dataset.accordion_body && body.classList.contains('hide')) {
                        _this.showAndExpand(body);
                        var point = element.querySelector('i[data-role="pointer"]');
                        if (point) {
                            point.classList.add('rotate-90');
                        }
                    } else if (!body.classList.contains('hide')) {
                        _this.collapseAndHide(body, true);
                    }
                });
            }
        }
    },

    showAndExpand: function(element) {
        if (element.dataset.accordion_layer === '2') {
            this.parentBody = this.getParentBody(element, 'accordion_body', '1');
            this.parentBody.style.height = '';
        }
        element.style.height = '0px';
        element.style.padding = '';
        element.classList.add('transitioning');
        element.classList.remove('hide');
        element.style.height = this.calcHeightElement(element) + 'px';
    },

    collapseAndHide: function(element, collapseParent) {
        if (element.dataset.accordion_layer === '2' && collapseParent) {
            this.parentBody = this.getParentBody(element, 'accordion_body', '1');
            this.parentBody.style.height = '';
        }
        element.classList.add('transitioning');
        element.style.height = '0px';
        element.style.padding = '0px';
    },

    transitionEnd: function(event) {
        if (event.target.dataset.accordion_body) {
            if (event.target.style.height === '0px') {
                event.target.classList.add('hide');
                if (event.target.dataset.accordion_layer === '2' && !this.parentBody.classList.contains('transitioning')) {
                    this.parentBody.style.height = this.calcHeightElement(this.parentBody) + 'px';
                }
            } else {
                if (event.target.dataset.accordion_layer === '2') {
                    this.parentBody.style.height = this.calcHeightElement(this.parentBody) + 'px';
                }
            }
            event.target.classList.remove('transitioning');
        }
    },

    getElementsLayer: function(layer) {
        this.bodyElements = Array.prototype.slice.call(document.querySelectorAll('[data-accordion_layer="' + layer + '"][data-accordion_body]'));
        this.pointerElements = Array.prototype.slice.call(document.querySelectorAll('i[data-role="pointer"]'));
    },

    calcHeightElement: function(element) {
        var height = element.scrollHeight;
        var options = getComputedStyle(element);
        var paddingTop = parseInt(options.paddingTop);
        var paddingBottom = parseInt(options.paddingBottom);
        if (paddingTop) {
            height -= paddingTop;
        }
        if (paddingBottom) {
            height -= paddingBottom;
        }
        return height;
    },

    getDataParameter: function(element, param, _n) {
        if (!element) {
            return null;
        }

        var n = !( _n === undefined || _n === null ) ? _n : 5;
        if (n > 0) {
            if (!element.dataset || !element.dataset[param]) {
                return this.getDataParameter(element.parentNode, param, n - 1);
            } else if (element.dataset[param]) {
                return element;
            }
        }
        return null;
    },

    getParentBody: function(element, param, layer, _n) {
        if (!element) {
            return null;
        }

        var n = !( _n === undefined || _n === null ) ? _n : 5;
        if (n > 0) {
            if (!element.dataset || !element.dataset[param] || layer === undefined || element.dataset.accordion_layer !== layer) {
                return this.getParentBody(element.parentNode, param, layer, n - 1);
            } else if (element.dataset[param]) {
                return element;
            }
        }
        return null;
    }
};

window.onload = function() {
    var accordion = new Accordion();
    accordion.addEventListeners();
};