var dat = dat || {};
dat.gui = dat.gui || {};
dat.utils = dat.utils || {};
dat.controllers = dat.controllers || {};
dat.dom = dat.dom || {};
dat.color = dat.color || {};
dat.utils.css = (function() {
    return {
        load: function(a, c) {
            c = c || document;
            var b = c.createElement("link");
            b.type = "text/css";
            b.rel = "stylesheet";
            b.href = a;
            c.getElementsByTagName("head")[0].appendChild(b)
        },
        inject: function(b, c) {
            c = c || document;
            var a = document.createElement("style");
            a.type = "text/css";
            a.innerHTML = b;
            c.getElementsByTagName("head")[0].appendChild(a)
        }
    }
})();
dat.utils.common = (function() {
    var a = Array.prototype.forEach;
    var b = Array.prototype.slice;
    return {
        BREAK: {},
        extend: function(c) {
            this.each(b.call(arguments, 1), function(e) {
                for (var d in e) {
                    if (!this.isUndefined(e[d])) {
                        c[d] = e[d]
                    }
                }
            }, this);
            return c
        },
        defaults: function(c) {
            this.each(b.call(arguments, 1), function(e) {
                for (var d in e) {
                    if (this.isUndefined(c[d])) {
                        c[d] = e[d]
                    }
                }
            }, this);
            return c
        },
        compose: function() {
            var c = b.call(arguments);
            return function() {
                var d = b.call(arguments);
                for (var e = c.length - 1; e >= 0; e--) {
                    d = [c[e].apply(this, d)]
                }
                return d[0]
            }
        },
        each: function(g, f, e) {
            if (a && g.forEach === a) {
                g.forEach(f, e)
            } else {
                if (g.length === g.length + 0) {
                    for (var d = 0, c = g.length; d < c; d++) {
                        if (d in g && f.call(e, g[d], d) === this.BREAK) {
                            return
                        }
                    }
                } else {
                    for (var d in g) {
                        if (f.call(e, g[d], d) === this.BREAK) {
                            return
                        }
                    }
                }
            }
        },
        defer: function(c) {
            setTimeout(c, 0)
        },
        toArray: function(c) {
            if (c.toArray) {
                return c.toArray()
            }
            return b.call(c)
        },
        isUndefined: function(c) {
            return c === undefined
        },
        isNull: function(c) {
            return c === null
        },
        isNaN: function(c) {
            return c !== c
        },
        isArray: Array.isArray || function(c) {
            return c.constructor === Array
        },
        isObject: function(c) {
            return c === Object(c)
        },
        isNumber: function(c) {
            return c === c + 0
        },
        isString: function(c) {
            return c === c + ""
        },
        isBoolean: function(c) {
            return c === false || c === true
        },
        isFunction: function(c) {
            return Object.prototype.toString.call(c) === "[object Function]"
        }
    }
})();
dat.controllers.Controller = (function(a) {
    var b = function(c, d) {
        this.initialValue = c[d];
        this.domElement = document.createElement("div");
        this.object = c;
        this.property = d;
        this.__onChange = undefined;
        this.__onFinishChange = undefined
    };
    a.extend(b.prototype, {
        onChange: function(c) {
            this.__onChange = c;
            return this
        },
        onFinishChange: function(c) {
            this.__onFinishChange = c;
            return this
        },
        setValue: function(c) {
            this.object[this.property] = c;
            if (this.__onChange) {
                this.__onChange.call(this, c)
            }
            this.updateDisplay();
            return this
        },
        getValue: function() {
            return this.object[this.property]
        },
        updateDisplay: function() {
            return this
        },
        isModified: function() {
            return this.initialValue !== this.getValue()
        }
    });
    return b
})(dat.utils.common);
dat.dom.dom = (function(b) {
    var f = {
        HTMLEvents: ["change"],
        MouseEvents: ["click", "mousemove", "mousedown", "mouseup", "mouseover"],
        KeyboardEvents: ["keydown"]
    };
    var e = {};
    b.each(f, function(h, g) {
        b.each(h, function(i) {
            e[i] = g
        })
    });
    var a = /(\d+(\.\d+)?)px/;

    function c(h) {
        if (h === "0" || b.isUndefined(h)) {
            return 0
        }
        var g = h.match(a);
        if (!b.isNull(g)) {
            return parseFloat(g[1])
        }
        return 0
    }
    var d = {
        makeSelectable: function(h, g) {
            if (h === undefined || h.style === undefined) {
                return
            }
            h.onselectstart = g ? function() {
                return false
            } : function() {};
            h.style.MozUserSelect = g ? "auto" : "none";
            h.style.KhtmlUserSelect = g ? "auto" : "none";
            h.unselectable = g ? "on" : "off"
        },
        makeFullscreen: function(i, g, h) {
            if (b.isUndefined(g)) {
                g = true
            }
            if (b.isUndefined(h)) {
                h = true
            }
            i.style.position = "absolute";
            if (g) {
                i.style.left = 0;
                i.style.right = 0
            }
            if (h) {
                i.style.top = 0;
                i.style.bottom = 0
            }
        },
        fakeEvent: function(k, i, l, j) {
            l = l || {};
            var m = e[i];
            if (!m) {
                throw new Error("Event type " + i + " not supported.")
            }
            var n = document.createEvent(m);
            switch (m) {
                case "MouseEvents":
                    var h = l.x || l.clientX || 0;
                    var g = l.y || l.clientY || 0;
                    n.initMouseEvent(i, l.bubbles || false, l.cancelable || true, window, l.clickCount || 1, 0, 0, h, g, false, false, false, false, 0, null);
                    break;
                case "KeyboardEvents":
                    var o = n.initKeyboardEvent || n.initKeyEvent;
                    b.defaults(l, {
                        cancelable: true,
                        ctrlKey: false,
                        altKey: false,
                        shiftKey: false,
                        metaKey: false,
                        keyCode: undefined,
                        charCode: undefined
                    });
                    o(i, l.bubbles || false, l.cancelable, window, l.ctrlKey, l.altKey, l.shiftKey, l.metaKey, l.keyCode, l.charCode);
                    break;
                default:
                    n.initEvent(i, l.bubbles || false, l.cancelable || true);
                    break
            }
            b.defaults(n, j);
            k.dispatchEvent(n)
        },
        bind: function(j, i, h, g) {
            g = g || false;
            if (j.addEventListener) {
                j.addEventListener(i, h, g)
            } else {
                if (j.attachEvent) {
                    j.attachEvent("on" + i, h)
                }
            }
            return d
        },
        unbind: function(j, i, h, g) {
            g = g || false;
            if (j.removeEventListener) {
                j.removeEventListener(i, h, g)
            } else {
                if (j.detachEvent) {
                    j.detachEvent("on" + i, h)
                }
            }
            return d
        },
        addClass: function(i, h) {
            if (i.className === undefined) {
                i.className = h
            } else {
                if (i.className !== h) {
                    var g = i.className.split(/ +/);
                    if (g.indexOf(h) == -1) {
                        g.push(h);
                        i.className = g.join(" ").replace(/^\s+/, "").replace(/\s+$/, "")
                    }
                }
            }
            return d
        },
        removeClass: function(j, i) {
            if (i) {
                if (j.className === undefined) {} else {
                    if (j.className === i) {
                        j.removeAttribute("class")
                    } else {
                        var h = j.className.split(/ +/);
                        var g = h.indexOf(i);
                        if (g != -1) {
                            h.splice(g, 1);
                            j.className = h.join(" ")
                        }
                    }
                }
            } else {
                j.className = undefined
            }
            return d
        },
        hasClass: function(h, g) {
            return new RegExp("(?:^|\\s+)" + g + "(?:\\s+|$)").test(h.className) || false
        },
        getWidth: function(h) {
            var g = getComputedStyle(h);
            return c(g["border-left-width"]) + c(g["border-right-width"]) + c(g["padding-left"]) + c(g["padding-right"]) + c(g.width)
        },
        getHeight: function(h) {
            var g = getComputedStyle(h);
            return c(g["border-top-width"]) + c(g["border-bottom-width"]) + c(g["padding-top"]) + c(g["padding-bottom"]) + c(g.height)
        },
        getOffset: function(g) {
            var h = {
                left: 0,
                top: 0
            };
            if (g.offsetParent) {
                do {
                    h.left += g.offsetLeft;
                    h.top += g.offsetTop
                } while (g = g.offsetParent)
            }
            return h
        },
        isActive: function(g) {
            return g === document.activeElement && (g.type || g.href)
        }
    };
    return d
})(dat.utils.common);
dat.controllers.OptionController = (function(c, d, a) {
    var b = function(f, g, e) {
        b.superclass.call(this, f, g);
        var i = this;
        this.__select = document.createElement("select");
        if (a.isArray(e)) {
            var h = {};
            a.each(e, function(j) {
                h[j] = j
            });
            e = h
        }
        a.each(e, function(l, k) {
            var j = document.createElement("option");
            j.innerHTML = k;
            j.setAttribute("value", l);
            i.__select.appendChild(j)
        });
        this.updateDisplay();
        d.bind(this.__select, "change", function() {
            var j = this.options[this.selectedIndex].value;
            i.setValue(j)
        });
        this.domElement.appendChild(this.__select)
    };
    b.superclass = c;
    a.extend(b.prototype, c.prototype, {
        setValue: function(e) {
            var f = b.superclass.prototype.setValue.call(this, e);
            if (this.__onFinishChange) {
                this.__onFinishChange.call(this, this.getValue())
            }
            return f
        },
        updateDisplay: function() {
            this.__select.value = this.getValue();
            return b.superclass.prototype.updateDisplay.call(this)
        }
    });
    return b
})(dat.controllers.Controller, dat.dom.dom, dat.utils.common);
dat.controllers.NumberController = (function(d, b) {
    var c = function(e, f, g) {
        c.superclass.call(this, e, f);
        g = g || {};
        this.__min = g.min;
        this.__max = g.max;
        this.__step = g.step;
        if (b.isUndefined(this.__step)) {
            if (this.initialValue == 0) {
                this.__impliedStep = 1
            } else {
                this.__impliedStep = Math.pow(10, Math.floor(Math.log(this.initialValue) / Math.LN10)) / 10
            }
        } else {
            this.__impliedStep = this.__step
        }
        this.__precision = a(this.__impliedStep)
    };
    c.superclass = d;
    b.extend(c.prototype, d.prototype, {
        setValue: function(e) {
            if (this.__min !== undefined && e < this.__min) {
                e = this.__min
            } else {
                if (this.__max !== undefined && e > this.__max) {
                    e = this.__max
                }
            }
            if (this.__step !== undefined && e % this.__step != 0) {
                e = Math.round(e / this.__step) * this.__step
            }
            return c.superclass.prototype.setValue.call(this, e)
        },
        min: function(e) {
            this.__min = e;
            return this
        },
        max: function(e) {
            this.__max = e;
            return this
        },
        step: function(e) {
            this.__step = e;
            return this
        }
    });

    function a(e) {
        e = e.toString();
        if (e.indexOf(".") > -1) {
            return e.length - e.indexOf(".") - 1
        } else {
            return 0
        }
    }
    return c
})(dat.controllers.Controller, dat.utils.common);
dat.controllers.NumberControllerBox = (function(d, e, c) {
    var b = function(h, o, g) {
        this.__truncationSuspended = false;
        b.superclass.call(this, h, o, g);
        var l = this;
        var j;
        this.__input = document.createElement("input");
        this.__input.setAttribute("type", "text");
        e.bind(this.__input, "change", m);
        e.bind(this.__input, "blur", f);
        e.bind(this.__input, "mousedown", n);
        e.bind(this.__input, "keydown", function(p) {
            if (p.keyCode === 13) {
                l.__truncationSuspended = true;
                this.blur();
                l.__truncationSuspended = false
            }
        });

        function m() {
            var p = parseFloat(l.__input.value);
            if (!c.isNaN(p)) {
                l.setValue(p)
            }
        }

        function f() {
            m();
            if (l.__onFinishChange) {
                l.__onFinishChange.call(l, l.getValue())
            }
        }

        function n(p) {
            e.bind(window, "mousemove", i);
            e.bind(window, "mouseup", k);
            j = p.clientY
        }

        function i(q) {
            var p = j - q.clientY;
            l.setValue(l.getValue() + p * l.__impliedStep);
            j = q.clientY
        }

        function k() {
            e.unbind(window, "mousemove", i);
            e.unbind(window, "mouseup", k)
        }
        this.updateDisplay();
        this.domElement.appendChild(this.__input)
    };
    b.superclass = d;
    c.extend(b.prototype, d.prototype, {
        updateDisplay: function() {
            this.__input.value = this.__truncationSuspended ? this.getValue() : a(this.getValue(), this.__precision);
            return b.superclass.prototype.updateDisplay.call(this)
        }
    });

    function a(g, f) {
        var h = Math.pow(10, f);
        return Math.round(g * h) / h
    }
    return b
})(dat.controllers.NumberController, dat.dom.dom, dat.utils.common);
dat.controllers.NumberControllerSlider = (function(d, f, a, b, g) {
    var c = function(i, p, j, n, h) {
        c.superclass.call(this, i, p, {
            min: j,
            max: n,
            step: h
        });
        var m = this;
        this.__background = document.createElement("div");
        this.__foreground = document.createElement("div");
        f.bind(this.__background, "mousedown", o);
        f.addClass(this.__background, "slider");
        f.addClass(this.__foreground, "slider-fg");

        function o(q) {
            f.bind(window, "mousemove", k);
            f.bind(window, "mouseup", l);
            k(q)
        }

        function k(r) {
            r.preventDefault();
            var s = f.getOffset(m.__background);
            var q = f.getWidth(m.__background);
            m.setValue(e(r.clientX, s.left, s.left + q, m.__min, m.__max));
            return false
        }

        function l() {
            f.unbind(window, "mousemove", k);
            f.unbind(window, "mouseup", l);
            if (m.__onFinishChange) {
                m.__onFinishChange.call(m, m.getValue())
            }
        }
        this.updateDisplay();
        this.__background.appendChild(this.__foreground);
        this.domElement.appendChild(this.__background)
    };
    c.superclass = d;
    c.useDefaultStyles = function() {
        a.inject(g)
    };
    b.extend(c.prototype, d.prototype, {
        updateDisplay: function() {
            var h = (this.getValue() - this.__min) / (this.__max - this.__min);
            this.__foreground.style.width = h * 100 + "%";
            return c.superclass.prototype.updateDisplay.call(this)
        }
    });

    function e(h, k, i, l, j) {
        return l + (j - l) * ((h - k) / (i - k))
    }
    return c
})(dat.controllers.NumberController, dat.dom.dom, dat.utils.css, dat.utils.common, ".slider {\n  box-shadow: inset 0 2px 4px rgba(0,0,0,0.15);\n  height: 1em;\n  border-radius: 1em;\n  background-color: #eee;\n  padding: 0 0.5em;\n  overflow: hidden;\n}\n\n.slider-fg {\n  padding: 1px 0 2px 0;\n  background-color: #aaa;\n  height: 1em;\n  margin-left: -0.5em;\n  padding-right: 0.5em;\n  border-radius: 1em 0 0 1em;\n}\n\n.slider-fg:after {\n  display: inline-block;\n  border-radius: 1em;\n  background-color: #fff;\n  border:  1px solid #aaa;\n  content: '';\n  float: right;\n  margin-right: -1em;\n  margin-top: -1px;\n  height: 0.9em;\n  width: 0.9em;\n}");
dat.controllers.FunctionController = (function(b, c, a) {
    var d = function(e, f, g) {
        d.superclass.call(this, e, f);
        var h = this;
        this.__button = document.createElement("div");
        this.__button.innerHTML = g === undefined ? "Fire" : g;
        c.bind(this.__button, "click", function(i) {
            i.preventDefault();
            h.fire();
            return false
        });
        c.addClass(this.__button, "button");
        this.domElement.appendChild(this.__button)
    };
    d.superclass = b;
    a.extend(d.prototype, b.prototype, {
        fire: function() {
            if (this.__onChange) {
                this.__onChange.call(this)
            }
            if (this.__onFinishChange) {
                this.__onFinishChange.call(this, this.getValue())
            }
            this.getValue().call(this.object)
        }
    });
    return d
})(dat.controllers.Controller, dat.dom.dom, dat.utils.common);
dat.controllers.BooleanController = (function(c, d, a) {
    var b = function(f, g) {
        b.superclass.call(this, f, g);
        var h = this;
        this.__prev = this.getValue();
        this.__checkbox = document.createElement("input");
        this.__checkbox.setAttribute("type", "checkbox");
        d.bind(this.__checkbox, "change", e, false);
        this.domElement.appendChild(this.__checkbox);
        this.updateDisplay();

        function e() {
            h.setValue(!h.__prev)
        }
    };
    b.superclass = c;
    a.extend(b.prototype, c.prototype, {
        setValue: function(e) {
            var f = b.superclass.prototype.setValue.call(this, e);
            if (this.__onFinishChange) {
                this.__onFinishChange.call(this, this.getValue())
            }
            this.__prev = this.getValue();
            return f
        },
        updateDisplay: function() {
            if (this.getValue() === true) {
                this.__checkbox.setAttribute("checked", "checked");
                this.__checkbox.checked = true
            } else {
                this.__checkbox.checked = false
            }
            return b.superclass.prototype.updateDisplay.call(this)
        }
    });
    return b
})(dat.controllers.Controller, dat.dom.dom, dat.utils.common);
dat.color.toString = (function(a) {
    return function(b) {
        if (b.a == 1 || a.isUndefined(b.a)) {
            var c = b.hex.toString(16);
            while (c.length < 6) {
                c = "0" + c
            }
            return "#" + c
        } else {
            return "rgba(" + Math.round(b.r) + "," + Math.round(b.g) + "," + Math.round(b.b) + "," + b.a + ")"
        }
    }
})(dat.utils.common);
dat.color.interpret = (function(d, c) {
    var a, f;
    var b = function() {
        f = false;
        var g = arguments.length > 1 ? c.toArray(arguments) : arguments[0];
        c.each(e, function(h) {
            if (h.litmus(g)) {
                c.each(h.conversions, function(j, i) {
                    a = j.read(g);
                    if (f === false && a !== false) {
                        f = a;
                        a.conversionName = i;
                        a.conversion = j;
                        return c.BREAK
                    }
                });
                return c.BREAK
            }
        });
        return f
    };
    var e = [{
        litmus: c.isString,
        conversions: {
            THREE_CHAR_HEX: {
                read: function(g) {
                    var h = g.match(/^#([A-F0-9])([A-F0-9])([A-F0-9])$/i);
                    if (h === null) {
                        return false
                    }
                    return {
                        space: "HEX",
                        hex: parseInt("0x" + h[1].toString() + h[1].toString() + h[2].toString() + h[2].toString() + h[3].toString() + h[3].toString())
                    }
                },
                write: d
            },
            SIX_CHAR_HEX: {
                read: function(g) {
                    var h = g.match(/^#([A-F0-9]{6})$/i);
                    if (h === null) {
                        return false
                    }
                    return {
                        space: "HEX",
                        hex: parseInt("0x" + h[1].toString())
                    }
                },
                write: d
            },
            CSS_RGB: {
                read: function(g) {
                    var h = g.match(/^rgb\(\s*(.+)\s*,\s*(.+)\s*,\s*(.+)\s*\)/);
                    if (h === null) {
                        return false
                    }
                    return {
                        space: "RGB",
                        r: parseFloat(h[1]),
                        g: parseFloat(h[2]),
                        b: parseFloat(h[3])
                    }
                },
                write: d
            },
            CSS_RGBA: {
                read: function(g) {
                    var h = g.match(/^rgba\(\s*(.+)\s*,\s*(.+)\s*,\s*(.+)\s*\,\s*(.+)\s*\)/);
                    if (h === null) {
                        return false
                    }
                    return {
                        space: "RGB",
                        r: parseFloat(h[1]),
                        g: parseFloat(h[2]),
                        b: parseFloat(h[3]),
                        a: parseFloat(h[4])
                    }
                },
                write: d
            }
        }
    }, {
        litmus: c.isNumber,
        conversions: {
            HEX: {
                read: function(g) {
                    return {
                        space: "HEX",
                        hex: g,
                        conversionName: "HEX"
                    }
                },
                write: function(g) {
                    return g.hex
                }
            }
        }
    }, {
        litmus: c.isArray,
        conversions: {
            RGB_ARRAY: {
                read: function(g) {
                    if (g.length != 3) {
                        return false
                    }
                    return {
                        space: "RGB",
                        r: g[0],
                        g: g[1],
                        b: g[2]
                    }
                },
                write: function(g) {
                    return [g.r, g.g, g.b]
                }
            },
            RGBA_ARRAY: {
                read: function(g) {
                    if (g.length != 4) {
                        return false
                    }
                    return {
                        space: "RGB",
                        r: g[0],
                        g: g[1],
                        b: g[2],
                        a: g[3]
                    }
                },
                write: function(g) {
                    return [g.r, g.g, g.b, g.a]
                }
            }
        }
    }, {
        litmus: c.isObject,
        conversions: {
            RGBA_OBJ: {
                read: function(g) {
                    if (c.isNumber(g.r) && c.isNumber(g.g) && c.isNumber(g.b) && c.isNumber(g.a)) {
                        return {
                            space: "RGB",
                            r: g.r,
                            g: g.g,
                            b: g.b,
                            a: g.a
                        }
                    }
                    return false
                },
                write: function(g) {
                    return {
                        r: g.r,
                        g: g.g,
                        b: g.b,
                        a: g.a
                    }
                }
            },
            RGB_OBJ: {
                read: function(g) {
                    if (c.isNumber(g.r) && c.isNumber(g.g) && c.isNumber(g.b)) {
                        return {
                            space: "RGB",
                            r: g.r,
                            g: g.g,
                            b: g.b
                        }
                    }
                    return false
                },
                write: function(g) {
                    return {
                        r: g.r,
                        g: g.g,
                        b: g.b
                    }
                }
            },
            HSVA_OBJ: {
                read: function(g) {
                    if (c.isNumber(g.h) && c.isNumber(g.s) && c.isNumber(g.v) && c.isNumber(g.a)) {
                        return {
                            space: "HSV",
                            h: g.h,
                            s: g.s,
                            v: g.v,
                            a: g.a
                        }
                    }
                    return false
                },
                write: function(g) {
                    return {
                        h: g.h,
                        s: g.s,
                        v: g.v,
                        a: g.a
                    }
                }
            },
            HSV_OBJ: {
                read: function(g) {
                    if (c.isNumber(g.h) && c.isNumber(g.s) && c.isNumber(g.v)) {
                        return {
                            space: "HSV",
                            h: g.h,
                            s: g.s,
                            v: g.v
                        }
                    }
                    return false
                },
                write: function(g) {
                    return {
                        h: g.h,
                        s: g.s,
                        v: g.v
                    }
                }
            }
        }
    }];
    return b
})(dat.color.toString, dat.utils.common);
dat.GUI = dat.gui.GUI = (function(E, G, i, h, f, y, o, r, L, A, t, l, j, c, s) {
    E.inject(i);
    var B = "dg";
    var z = 72;
    var k = 20;
    var b = "Default";
    var a = (function() {
        try {
            return "localStorage" in window && window.localStorage
        } catch (N) {
            return false
        }
    })();
    var w;
    var M = true;
    var p;
    var H = false;
    var D = [];
    var g = function(R) {
        var S = this;
        this.domElement = document.createElement("div");
        this.__ul = document.createElement("ul");
        this.domElement.appendChild(this.__ul);
        c.addClass(this.domElement, B);
        this.__folders = {};
        this.__controllers = [];
        this.__rememberedObjects = [];
        this.__rememberedObjectIndecesToControllers = [];
        this.__listening = [];
        R = R || {};
        R = s.defaults(R, {
            autoPlace: true,
            width: g.DEFAULT_WIDTH
        });
        R = s.defaults(R, {
            resizable: R.autoPlace,
            hideable: R.autoPlace
        });
        if (!s.isUndefined(R.load)) {
            if (R.preset) {
                R.load.preset = R.preset
            }
        } else {
            R.load = {
                preset: b
            }
        }
        if (s.isUndefined(R.parent) && R.hideable) {
            D.push(this)
        }
        R.resizable = s.isUndefined(R.parent) && R.resizable;
        if (R.autoPlace && s.isUndefined(R.scrollable)) {
            R.scrollable = true
        }
        var U = a && localStorage.getItem(q(this, "isLocal")) === "true";
        Object.defineProperties(this, {
            parent: {
                get: function() {
                    return R.parent
                }
            },
            scrollable: {
                get: function() {
                    return R.scrollable
                }
            },
            autoPlace: {
                get: function() {
                    return R.autoPlace
                }
            },
            preset: {
                get: function() {
                    if (S.parent) {
                        return S.getRoot().preset
                    } else {
                        return R.load.preset
                    }
                },
                set: function(X) {
                    if (S.parent) {
                        S.getRoot().preset = X
                    } else {
                        R.load.preset = X
                    }
                    u(this);
                    S.revert()
                }
            },
            width: {
                get: function() {
                    return R.width
                },
                set: function(X) {
                    R.width = X;
                    I(S, X)
                }
            },
            name: {
                get: function() {
                    return R.name
                },
                set: function(X) {
                    R.name = X;
                    if (O) {
                        O.innerHTML = R.name
                    }
                }
            },
            closed: {
                get: function() {
                    return R.closed
                },
                set: function(X) {
                    R.closed = X;
                    if (R.closed) {
                        c.addClass(S.__ul, g.CLASS_CLOSED)
                    } else {
                        c.removeClass(S.__ul, g.CLASS_CLOSED)
                    }
                    this.onResize();
                    if (S.__closeButton) {
                        S.__closeButton.innerHTML = X ? g.TEXT_OPEN : g.TEXT_CLOSED
                    }
                }
            },
            load: {
                get: function() {
                    return R.load
                }
            },
            useLocalStorage: {
                get: function() {
                    return U
                },
                set: function(X) {
                    if (a) {
                        U = X;
                        if (X) {
                            c.bind(window, "unload", Q)
                        } else {
                            c.unbind(window, "unload", Q)
                        }
                        localStorage.setItem(q(S, "isLocal"), X)
                    }
                }
            }
        });
        if (s.isUndefined(R.parent)) {
            R.closed = false;
            c.addClass(this.domElement, g.CLASS_MAIN);
            c.makeSelectable(this.domElement, false);
            if (a) {
                if (U) {
                    S.useLocalStorage = true;
                    var N = localStorage.getItem(q(this, "gui"));
                    if (N) {
                        R.load = JSON.parse(N)
                    }
                }
            }
            this.__closeButton = document.createElement("div");
            this.__closeButton.innerHTML = g.TEXT_CLOSED;
            c.addClass(this.__closeButton, g.CLASS_CLOSE_BUTTON);
            this.domElement.appendChild(this.__closeButton);
            c.bind(this.__closeButton, "click", function() {
                S.closed = !S.closed
            })
        } else {
            if (R.closed === undefined) {
                R.closed = true
            }
            var O = document.createTextNode(R.name);
            c.addClass(O, "controller-name");
            var V = C(S, O);
            var W = function(X) {
                X.preventDefault();
                S.closed = !S.closed;
                return false
            };
            c.addClass(this.__ul, g.CLASS_CLOSED);
            c.addClass(V, "title");
            c.bind(V, "click", W);
            if (!R.closed) {
                this.closed = false
            }
        }
        if (R.autoPlace) {
            if (s.isUndefined(R.parent)) {
                if (M) {
                    p = document.createElement("div");
                    c.addClass(p, B);
                    c.addClass(p, g.CLASS_AUTO_PLACE_CONTAINER);
                    document.body.appendChild(p);
                    M = false
                }
                p.appendChild(this.domElement);
                c.addClass(this.domElement, g.CLASS_AUTO_PLACE)
            }
            if (!this.parent) {
                I(S, R.width)
            }
        }
        c.bind(window, "resize", function() {
            S.onResize()
        });
        c.bind(this.__ul, "webkitTransitionEnd", function() {
            S.onResize()
        });
        c.bind(this.__ul, "transitionend", function() {
            S.onResize()
        });
        c.bind(this.__ul, "oTransitionEnd", function() {
            S.onResize()
        });
        this.onResize();
        if (R.resizable) {
            K(this)
        }

        function Q() {
            localStorage.setItem(q(S, "gui"), JSON.stringify(S.getSaveObject()))
        }
        var T = S.getRoot();

        function P() {
            var X = S.getRoot();
            X.width += 1;
            s.defer(function() {
                X.width -= 1
            })
        }
        if (!R.parent) {
            P()
        }
    };
    g.toggleHide = function() {
        H = !H;
        s.each(D, function(N) {
            N.domElement.style.zIndex = H ? -999 : 999;
            N.domElement.style.opacity = H ? 0 : 1
        })
    };
    g.CLASS_AUTO_PLACE = "a";
    g.CLASS_AUTO_PLACE_CONTAINER = "ac";
    g.CLASS_MAIN = "main";
    g.CLASS_CONTROLLER_ROW = "cr";
    g.CLASS_TOO_TALL = "taller-than-window";
    g.CLASS_CLOSED = "closed";
    g.CLASS_CLOSE_BUTTON = "close-button";
    g.CLASS_DRAG = "drag";
    g.DEFAULT_WIDTH = 245;
    g.TEXT_CLOSED = "Close Controls";
    g.TEXT_OPEN = "Open Controls";
    c.bind(window, "keydown", function(N) {
        if (document.activeElement.type !== "text" && (N.which === z || N.keyCode == z)) {
            g.toggleHide()
        }
    }, false);
    s.extend(g.prototype, {
        add: function(N, O) {
            return d(this, N, O, {
                factoryArgs: Array.prototype.slice.call(arguments, 2)
            })
        },
        addColor: function(N, O) {
            return d(this, N, O, {
                color: true
            })
        },
        remove: function(N) {
            this.__ul.removeChild(N.__li);
            this.__controllers.slice(this.__controllers.indexOf(N), 1);
            var O = this;
            s.defer(function() {
                O.onResize()
            })
        },
        destroy: function() {
            if (this.autoPlace) {
                p.removeChild(this.domElement)
            }
        },
        addFolder: function(P) {
            if (this.__folders[P] !== undefined) {
                throw new Error('You already have a folder in this GUI by the name "' + P + '"')
            }
            var Q = {
                name: P,
                parent: this
            };
            Q.autoPlace = this.autoPlace;
            if (this.load && this.load.folders && this.load.folders[P]) {
                Q.closed = this.load.folders[P].closed;
                Q.load = this.load.folders[P]
            }
            var O = new g(Q);
            this.__folders[P] = O;
            var N = C(this, O.domElement);
            c.addClass(N, "folder");
            return O
        },
        open: function() {
            this.closed = false
        },
        close: function() {
            this.closed = true
        },
        onResize: function() {
            var N = this.getRoot();
            if (N.scrollable) {
                var P = c.getOffset(N.__ul).top;
                var O = 0;
                s.each(N.__ul.childNodes, function(Q) {
                    if (!(N.autoPlace && Q === N.__save_row)) {
                        O += c.getHeight(Q)
                    }
                });
                if (window.innerHeight - P - k < O) {
                    c.addClass(N.domElement, g.CLASS_TOO_TALL);
                    N.__ul.style.height = window.innerHeight - P - k + "px"
                } else {
                    c.removeClass(N.domElement, g.CLASS_TOO_TALL);
                    N.__ul.style.height = "auto"
                }
            }
            if (N.__resize_handle) {
                s.defer(function() {
                    N.__resize_handle.style.height = N.__ul.offsetHeight + "px"
                })
            }
            if (N.__closeButton) {
                N.__closeButton.style.width = N.width + "px"
            }
        },
        remember: function() {
            if (s.isUndefined(w)) {
                w = new j();
                w.domElement.innerHTML = G
            }
            if (this.parent) {
                throw new Error("You can only call remember on a top level GUI.")
            }
            var N = this;
            s.each(Array.prototype.slice.call(arguments), function(O) {
                if (N.__rememberedObjects.length == 0) {
                    v(N)
                }
                if (N.__rememberedObjects.indexOf(O) == -1) {
                    N.__rememberedObjects.push(O)
                }
            });
            if (this.autoPlace) {
                I(this, this.width)
            }
        },
        getRoot: function() {
            var N = this;
            while (N.parent) {
                N = N.parent
            }
            return N
        },
        getSaveObject: function() {
            var N = this.load;
            N.closed = this.closed;
            if (this.__rememberedObjects.length > 0) {
                N.preset = this.preset;
                if (!N.remembered) {
                    N.remembered = {}
                }
                N.remembered[this.preset] = F(this)
            }
            N.folders = {};
            s.each(this.__folders, function(P, O) {
                N.folders[O] = P.getSaveObject()
            });
            return N
        },
        save: function() {
            if (!this.load.remembered) {
                this.load.remembered = {}
            }
            this.load.remembered[this.preset] = F(this);
            n(this, false)
        },
        saveAs: function(N) {
            if (!this.load.remembered) {
                this.load.remembered = {};
                this.load.remembered[b] = F(this, true)
            }
            this.load.remembered[N] = F(this);
            this.preset = N;
            x(this, N, true)
        },
        revert: function(N) {
            s.each(this.__controllers, function(O) {
                if (!this.getRoot().load.remembered) {
                    O.setValue(O.initialValue)
                } else {
                    e(N || this.getRoot(), O)
                }
            }, this);
            s.each(this.__folders, function(O) {
                O.revert(O)
            });
            if (!N) {
                n(this.getRoot(), false)
            }
        },
        listen: function(N) {
            var O = this.__listening.length == 0;
            this.__listening.push(N);
            if (O) {
                J(this.__listening)
            }
        }
    });

    function d(P, R, U, Q) {
        if (R[U] === undefined) {
            throw new Error("Object " + R + ' has no property "' + U + '"')
        }
        var S;
        if (Q.color) {
            S = new t(R, U)
        } else {
            var V = [R, U].concat(Q.factoryArgs);
            S = h.apply(P, V)
        }
        if (Q.before instanceof f) {
            Q.before = Q.before.__li
        }
        e(P, S);
        c.addClass(S.domElement, "c");
        var N = document.createElement("span");
        c.addClass(N, "property-name");
        N.innerHTML = S.property;
        var O = document.createElement("div");
        O.appendChild(N);
        O.appendChild(S.domElement);
        var T = C(P, O, Q.before);
        c.addClass(T, g.CLASS_CONTROLLER_ROW);
        c.addClass(T, typeof S.getValue());
        m(P, T, S);
        P.__controllers.push(S);
        return S
    }

    function C(O, Q, P) {
        var N = document.createElement("li");
        if (Q) {
            N.appendChild(Q)
        }
        if (P) {
            O.__ul.insertBefore(N, params.before)
        } else {
            O.__ul.appendChild(N)
        }
        O.onResize();
        return N
    }

    function m(P, N, O) {
        O.__li = N;
        O.__gui = P;
        s.extend(O, {
            options: function(S) {
                if (arguments.length > 1) {
                    O.remove();
                    return d(P, O.object, O.property, {
                        before: O.__li.nextElementSibling,
                        factoryArgs: [s.toArray(arguments)]
                    })
                }
                if (s.isArray(S) || s.isObject(S)) {
                    O.remove();
                    return d(P, O.object, O.property, {
                        before: O.__li.nextElementSibling,
                        factoryArgs: [S]
                    })
                }
            },
            name: function(S) {
                O.__li.firstElementChild.firstElementChild.innerHTML = S;
                return O
            },
            listen: function() {
                O.__gui.listen(O);
                return O
            },
            remove: function() {
                O.__gui.remove(O);
                return O
            }
        });
        if (O instanceof L) {
            var R = new r(O.object, O.property, {
                min: O.__min,
                max: O.__max,
                step: O.__step
            });
            s.each(["updateDisplay", "onChange", "onFinishChange"], function(U) {
                var S = O[U];
                var T = R[U];
                O[U] = R[U] = function() {
                    var V = Array.prototype.slice.call(arguments);
                    S.apply(O, V);
                    return T.apply(R, V)
                }
            });
            c.addClass(N, "has-slider");
            O.domElement.insertBefore(R.domElement, O.domElement.firstElementChild)
        } else {
            if (O instanceof r) {
                var Q = function(S) {
                    if (s.isNumber(O.__min) && s.isNumber(O.__max)) {
                        O.remove();
                        return d(P, O.object, O.property, {
                            before: O.__li.nextElementSibling,
                            factoryArgs: [O.__min, O.__max, O.__step]
                        })
                    }
                    return S
                };
                O.min = s.compose(Q, O.min);
                O.max = s.compose(Q, O.max)
            } else {
                if (O instanceof y) {
                    c.bind(N, "click", function() {
                        c.fakeEvent(O.__checkbox, "click")
                    });
                    c.bind(O.__checkbox, "click", function(S) {
                        S.stopPropagation()
                    })
                } else {
                    if (O instanceof o) {
                        c.bind(N, "click", function() {
                            c.fakeEvent(O.__button, "click")
                        });
                        c.bind(N, "mouseover", function() {
                            c.addClass(O.__button, "hover")
                        });
                        c.bind(N, "mouseout", function() {
                            c.removeClass(O.__button, "hover")
                        })
                    } else {
                        if (O instanceof t) {
                            c.addClass(N, "color");
                            O.updateDisplay = s.compose(function(S) {
                                N.style.borderLeftColor = O.__color.toString();
                                return S
                            }, O.updateDisplay);
                            O.updateDisplay()
                        }
                    }
                }
            }
        }
        O.setValue = s.compose(function(S) {
            if (P.getRoot().__preset_select && O.isModified()) {
                n(P.getRoot(), true)
            }
            return S
        }, O.setValue)
    }

    function e(P, O) {
        var N = P.getRoot();
        var U = N.__rememberedObjects.indexOf(O.object);
        if (U != -1) {
            var R = N.__rememberedObjectIndecesToControllers[U];
            if (R === undefined) {
                R = {};
                N.__rememberedObjectIndecesToControllers[U] = R
            }
            R[O.property] = O;
            if (N.load && N.load.remembered) {
                var Q = N.load.remembered;
                var S;
                if (Q[P.preset]) {
                    S = Q[P.preset]
                } else {
                    if (Q[b]) {
                        S = Q[b]
                    } else {
                        return
                    }
                }
                if (S[U] && S[U][O.property] !== undefined) {
                    var T = S[U][O.property];
                    O.initialValue = T;
                    O.setValue(T)
                }
            }
        }
    }

    function q(N, O) {
        return document.location.href + "." + O
    }

    function v(Q) {
        var N = Q.__save_row = document.createElement("li");
        c.addClass(Q.domElement, "has-save");
        Q.__ul.insertBefore(N, Q.__ul.firstChild);
        c.addClass(N, "save-row");
        var P = document.createElement("span");
        P.innerHTML = "&nbsp;";
        c.addClass(P, "button gears");
        var R = document.createElement("span");
        R.innerHTML = "Save";
        c.addClass(R, "button");
        c.addClass(R, "save");
        var U = document.createElement("span");
        U.innerHTML = "New";
        c.addClass(U, "button");
        c.addClass(U, "save-as");
        var S = document.createElement("span");
        S.innerHTML = "Revert";
        c.addClass(S, "button");
        c.addClass(S, "revert");
        var Y = Q.__preset_select = document.createElement("select");
        if (Q.load && Q.load.remembered) {
            s.each(Q.load.remembered, function(aa, Z) {
                x(Q, Z, Z == Q.preset)
            })
        } else {
            x(Q, b, false)
        }
        c.bind(Y, "change", function() {
            for (var Z = 0; Z < Q.__preset_select.length; Z++) {
                Q.__preset_select[Z].innerHTML = Q.__preset_select[Z].value
            }
            Q.preset = this.value
        });
        N.appendChild(Y);
        N.appendChild(P);
        N.appendChild(R);
        N.appendChild(U);
        N.appendChild(S);
        if (a) {
            var X = document.getElementById("dg-save-locally");
            var T = document.getElementById("dg-local-explain");
            X.style.display = "block";
            var V = document.getElementById("dg-local-storage");
            if (localStorage.getItem(q(Q, "isLocal")) === "true") {
                V.setAttribute("checked", "checked")
            }

            function O() {
                T.style.display = Q.useLocalStorage ? "block" : "none"
            }
            O();
            c.bind(V, "change", function() {
                Q.useLocalStorage = !Q.useLocalStorage;
                O()
            })
        }
        var W = document.getElementById("dg-new-constructor");
        c.bind(W, "keydown", function(Z) {
            if (Z.metaKey && (Z.which === 67 || Z.keyCode == 67)) {
                w.hide()
            }
        });
        c.bind(P, "click", function() {
            W.innerHTML = JSON.stringify(Q.getSaveObject(), undefined, 2);
            w.show();
            W.focus();
            W.select()
        });
        c.bind(R, "click", function() {
            Q.save()
        });
        c.bind(U, "click", function() {
            var Z = prompt("Enter a new preset name.");
            if (Z) {
                Q.saveAs(Z)
            }
        });
        c.bind(S, "click", function() {
            Q.revert()
        })
    }

    function K(P) {
        P.__resize_handle = document.createElement("div");
        s.extend(P.__resize_handle.style, {
            width: "6px",
            marginLeft: "-3px",
            height: "200px",
            cursor: "ew-resize",
            position: "absolute"
        });
        var O;
        c.bind(P.__resize_handle, "mousedown", N);
        c.bind(P.__closeButton, "mousedown", N);
        P.domElement.insertBefore(P.__resize_handle, P.domElement.firstElementChild);

        function N(S) {
            S.preventDefault();
            O = S.clientX;
            c.addClass(P.__closeButton, g.CLASS_DRAG);
            c.bind(window, "mousemove", R);
            c.bind(window, "mouseup", Q);
            return false
        }

        function R(S) {
            S.preventDefault();
            P.width += O - S.clientX;
            P.onResize();
            O = S.clientX;
            return false
        }

        function Q() {
            c.removeClass(P.__closeButton, g.CLASS_DRAG);
            c.unbind(window, "mousemove", R);
            c.unbind(window, "mouseup", Q)
        }
    }

    function I(O, N) {
        O.domElement.style.width = N + "px";
        if (O.__save_row && O.autoPlace) {
            O.__save_row.style.width = N + "px"
        }
        if (O.__closeButton) {
            O.__closeButton.style.width = N + "px"
        }
    }

    function F(N, O) {
        var P = {};
        s.each(N.__rememberedObjects, function(T, R) {
            var Q = {};
            var S = N.__rememberedObjectIndecesToControllers[R];
            s.each(S, function(U, V) {
                Q[V] = O ? U.initialValue : U.getValue()
            });
            P[R] = Q
        });
        return P
    }

    function x(N, O, Q) {
        var P = document.createElement("option");
        P.innerHTML = O;
        P.value = O;
        N.__preset_select.appendChild(P);
        if (Q) {
            N.__preset_select.selectedIndex = N.__preset_select.length - 1
        }
    }

    function u(N) {
        for (var O = 0; O < N.__preset_select.length; O++) {
            if (N.__preset_select[O].value == N.preset) {
                N.__preset_select.selectedIndex = O
            }
        }
    }

    function n(N, O) {
        var P = N.__preset_select[N.__preset_select.selectedIndex];
        if (O) {
            P.innerHTML = P.value + "*"
        } else {
            P.innerHTML = P.value
        }
    }

    function J(N) {
        if (N.length != 0) {
            l(function() {
                J(N)
            })
        }
        s.each(N, function(O) {
            O.updateDisplay()
        })
    }
    return g
})(dat.utils.css, '<div id="dg-save" class="dg dialogue">\n\n  Here\'s the new load parameter for your <code>GUI</code>\'s constructor:\n\n  <textarea id="dg-new-constructor"></textarea>\n\n  <div id="dg-save-locally">\n\n    <input id="dg-local-storage" type="checkbox"/> Automatically save\n    values to <code>localStorage</code> on exit.\n\n    <div id="dg-local-explain">The values saved to <code>localStorage</code> will\n      override those passed to <code>dat.GUI</code>\'s constructor. This makes it\n      easier to work incrementally, but <code>localStorage</code> is fragile,\n      and your friends may not see the same values you do.\n      \n    </div>\n    \n  </div>\n\n</div>', ".dg ul{list-style:none;margin:0;padding:0;width:100%;clear:both}.dg.ac{position:fixed;top:0;left:0;right:0;height:0;z-index:0}.dg:not(.ac) .main{overflow:hidden}.dg.main{-webkit-transition:opacity 0.1s linear;-o-transition:opacity 0.1s linear;-moz-transition:opacity 0.1s linear;transition:opacity 0.1s linear}.dg.main.taller-than-window{overflow-y:auto}.dg.main.taller-than-window .close-button{opacity:1;margin-top:-1px;border-top:1px solid #2c2c2c}.dg.main ul.closed .close-button{opacity:1 !important}.dg.main:hover .close-button,.dg.main .close-button.drag{opacity:1}.dg.main .close-button{-webkit-transition:opacity 0.1s linear;-o-transition:opacity 0.1s linear;-moz-transition:opacity 0.1s linear;transition:opacity 0.1s linear;border:0;position:absolute;line-height:19px;height:20px;cursor:pointer;text-align:center;background-color:#000}.dg.main .close-button:hover{background-color:#111}.dg.a{float:right;margin-right:15px;overflow-x:hidden}.dg.a.has-save ul{margin-top:27px}.dg.a.has-save ul.closed{margin-top:0}.dg.a .save-row{position:fixed;top:0;z-index:1002}.dg li{-webkit-transition:height 0.1s ease-out;-o-transition:height 0.1s ease-out;-moz-transition:height 0.1s ease-out;transition:height 0.1s ease-out}.dg li:not(.folder){cursor:auto;height:27px;line-height:27px;overflow:hidden;padding:0 4px 0 5px}.dg li.folder{padding:0;border-left:4px solid rgba(0,0,0,0)}.dg li.title{cursor:pointer;margin-left:-4px}.dg .closed li:not(.title),.dg .closed ul li,.dg .closed ul li > *{height:0;overflow:hidden;border:0}.dg .cr{clear:both;padding-left:3px;height:27px}.dg .property-name{cursor:default;float:left;clear:left;width:40%;overflow:hidden;text-overflow:ellipsis}.dg .c{float:left;width:60%}.dg .c input[type=text]{border:0;margin-top:4px;padding:3px;width:100%;float:right}.dg .has-slider input[type=text]{width:30%;margin-left:0}.dg .slider{float:left;width:66%;margin-left:-5px;margin-right:0;height:19px;margin-top:4px}.dg .slider-fg{height:100%}.dg .c input[type=checkbox]{margin-top:9px}.dg .c select{margin-top:5px}.dg .cr.function,.dg .cr.function .property-name,.dg .cr.function *,.dg .cr.boolean,.dg .cr.boolean *{cursor:pointer}.dg .selector{display:none;position:absolute;margin-left:-9px;margin-top:23px;z-index:10}.dg .c:hover .selector,.dg .selector.drag{display:block}.dg li.save-row{padding:0}.dg li.save-row .button{display:inline-block;padding:0px 6px}.dg.dialogue{background-color:#222;width:460px;padding:15px;font-size:13px;line-height:15px}#dg-new-constructor{padding:10px;color:#222;font-family:Monaco, monospace;font-size:10px;border:0;resize:none;box-shadow:inset 1px 1px 1px #888;word-wrap:break-word;margin:12px 0;display:block;width:440px;overflow-y:scroll;height:100px;position:relative}#dg-local-explain{display:none;font-size:11px;line-height:17px;border-radius:3px;background-color:#333;padding:8px;margin-top:10px}#dg-local-explain code{font-size:10px}#dat-gui-save-locally{display:none}.dg{color:#eee;font:11px 'Lucida Grande', sans-serif;text-shadow:0 -1px 0 #111}.dg.main::-webkit-scrollbar{width:5px;background:#1a1a1a}.dg.main::-webkit-scrollbar-corner{height:0;display:none}.dg.main::-webkit-scrollbar-thumb{border-radius:5px;background:#676767}.dg li:not(.folder){background:#1a1a1a;border-bottom:1px solid #2c2c2c}.dg li.save-row{line-height:25px;background:#dad5cb;border:0}.dg li.save-row select{margin-left:5px;width:108px}.dg li.save-row .button{margin-left:5px;margin-top:1px;border-radius:2px;font-size:9px;line-height:7px;padding:4px 4px 5px 4px;background:#c5bdad;color:#fff;text-shadow:0 1px 0 #b0a58f;box-shadow:0 -1px 0 #b0a58f;cursor:pointer}.dg li.save-row .button.gears{background:#c5bdad url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAANCAYAAAB/9ZQ7AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAQJJREFUeNpiYKAU/P//PwGIC/ApCABiBSAW+I8AClAcgKxQ4T9hoMAEUrxx2QSGN6+egDX+/vWT4e7N82AMYoPAx/evwWoYoSYbACX2s7KxCxzcsezDh3evFoDEBYTEEqycggWAzA9AuUSQQgeYPa9fPv6/YWm/Acx5IPb7ty/fw+QZblw67vDs8R0YHyQhgObx+yAJkBqmG5dPPDh1aPOGR/eugW0G4vlIoTIfyFcA+QekhhHJhPdQxbiAIguMBTQZrPD7108M6roWYDFQiIAAv6Aow/1bFwXgis+f2LUAynwoIaNcz8XNx3Dl7MEJUDGQpx9gtQ8YCueB+D26OECAAQDadt7e46D42QAAAABJRU5ErkJggg==) 2px 1px no-repeat;height:7px;width:8px}.dg li.save-row .button:hover{background-color:#bab19e;box-shadow:0 -1px 0 #b0a58f}.dg li.folder{border-bottom:0}.dg li.title{padding-left:16px;background:#000 url(data:image/gif;base64,R0lGODlhBQAFAJEAAP////Pz8////////yH5BAEAAAIALAAAAAAFAAUAAAIIlI+hKgFxoCgAOw==) 6px 10px no-repeat;cursor:pointer;border-bottom:1px solid rgba(255,255,255,0.2)}.dg .closed li.title{background-image:url(data:image/gif;base64,R0lGODlhBQAFAJEAAP////Pz8////////yH5BAEAAAIALAAAAAAFAAUAAAIIlGIWqMCbWAEAOw==)}.dg .cr.boolean{border-left:3px solid #806787}.dg .cr.function{border-left:3px solid #e61d5f}.dg .cr.number{border-left:3px solid #2fa1d6}.dg .cr.number input[type=text]{color:#2fa1d6}.dg .cr.string{border-left:3px solid #1ed36f}.dg .cr.string input[type=text]{color:#1ed36f}.dg .cr.function:hover,.dg .cr.boolean:hover{background:#111}.dg .c input[type=text]{background:#303030;outline:none}.dg .c input[type=text]:hover{background:#3c3c3c}.dg .c input[type=text]:focus{background:#494949;color:#fff}.dg .c .slider{background:#303030;cursor:ew-resize}.dg .c .slider-fg{background:#2fa1d6}.dg .c .slider:hover{background:#3c3c3c}.dg .c .slider:hover .slider-fg{background:#44abda}\n", dat.controllers.factory = (function(e, c, d, a, g, f, b) {
    return function(i, j) {
        var h = i[j];
        if (b.isArray(arguments[2]) || b.isObject(arguments[2])) {
            return new e(i, j, arguments[2])
        }
        if (b.isNumber(h)) {
            if (b.isNumber(arguments[2]) && b.isNumber(arguments[3])) {
                return new d(i, j, arguments[2], arguments[3])
            } else {
                return new c(i, j, {
                    min: arguments[2],
                    max: arguments[3]
                })
            }
        }
        if (b.isString(h)) {
            return new a(i, j)
        }
        if (b.isFunction(h)) {
            return new g(i, j, "")
        }
        if (b.isBoolean(h)) {
            return new f(i, j)
        }
    }
})(dat.controllers.OptionController, dat.controllers.NumberControllerBox, dat.controllers.NumberControllerSlider, dat.controllers.StringController = (function(c, d, b) {
    var a = function(f, h) {
        a.superclass.call(this, f, h);
        var i = this;
        this.__input = document.createElement("input");
        this.__input.setAttribute("type", "text");
        d.bind(this.__input, "keyup", e);
        d.bind(this.__input, "change", e);
        d.bind(this.__input, "blur", g);
        d.bind(this.__input, "keydown", function(j) {
            if (j.keyCode === 13) {
                this.blur()
            }
        });

        function e() {
            i.setValue(i.__input.value)
        }

        function g() {
            if (i.__onFinishChange) {
                i.__onFinishChange.call(i, i.getValue())
            }
        }
        this.updateDisplay();
        this.domElement.appendChild(this.__input)
    };
    a.superclass = c;
    b.extend(a.prototype, c.prototype, {
        updateDisplay: function() {
            if (!d.isActive(this.__input)) {
                this.__input.value = this.getValue()
            }
            return a.superclass.prototype.updateDisplay.call(this)
        }
    });
    return a
})(dat.controllers.Controller, dat.dom.dom, dat.utils.common), dat.controllers.FunctionController, dat.controllers.BooleanController, dat.utils.common), dat.controllers.Controller, dat.controllers.BooleanController, dat.controllers.FunctionController, dat.controllers.NumberControllerBox, dat.controllers.NumberControllerSlider, dat.controllers.OptionController, dat.controllers.ColorController = (function(c, d, a, b, f) {
    var e = function(m, r) {
        e.superclass.call(this, m, r);
        this.__color = new a(this.getValue());
        this.__temp = new a(0);
        var p = this;
        this.domElement = document.createElement("div");
        d.makeSelectable(this.domElement, false);
        this.__selector = document.createElement("div");
        this.__selector.className = "selector";
        this.__saturation_field = document.createElement("div");
        this.__saturation_field.className = "saturation-field";
        this.__field_knob = document.createElement("div");
        this.__field_knob.className = "field-knob";
        this.__field_knob_border = "2px solid ";
        this.__hue_knob = document.createElement("div");
        this.__hue_knob.className = "hue-knob";
        this.__hue_field = document.createElement("div");
        this.__hue_field.className = "hue-field";
        this.__input = document.createElement("input");
        this.__input.type = "text";
        this.__input_textShadow = "0 1px 1px ";
        d.bind(this.__input, "keydown", function(t) {
            if (t.keyCode === 13) {
                j.call(this)
            }
        });
        d.bind(this.__input, "blur", j);
        d.bind(this.__selector, "mousedown", function(t) {
            d.addClass(this, "drag").bind(window, "mouseup", function(u) {
                d.removeClass(p.__selector, "drag")
            })
        });
        var n = document.createElement("div");
        f.extend(this.__selector.style, {
            width: "122px",
            height: "102px",
            padding: "3px",
            backgroundColor: "#222",
            boxShadow: "0px 1px 3px rgba(0,0,0,0.3)"
        });
        f.extend(this.__field_knob.style, {
            position: "absolute",
            width: "12px",
            height: "12px",
            border: this.__field_knob_border + (this.__color.v < 0.5 ? "#fff" : "#000"),
            boxShadow: "0px 1px 3px rgba(0,0,0,0.5)",
            borderRadius: "12px",
            zIndex: 1
        });
        f.extend(this.__hue_knob.style, {
            position: "absolute",
            width: "15px",
            height: "2px",
            borderRight: "4px solid #fff",
            zIndex: 1
        });
        f.extend(this.__saturation_field.style, {
            width: "100px",
            height: "100px",
            border: "1px solid #555",
            marginRight: "3px",
            display: "inline-block",
            cursor: "pointer"
        });
        f.extend(n.style, {
            width: "100%",
            height: "100%",
            background: "none"
        });
        g(n, "top", "rgba(0,0,0,0)", "#000");
        f.extend(this.__hue_field.style, {
            width: "15px",
            height: "100px",
            display: "inline-block",
            border: "1px solid #555",
            cursor: "ns-resize"
        });
        i(this.__hue_field);
        f.extend(this.__input.style, {
            outline: "none",
            textAlign: "center",
            color: "#fff",
            border: 0,
            fontWeight: "bold",
            textShadow: this.__input_textShadow + "rgba(0,0,0,0.7)"
        });
        d.bind(this.__saturation_field, "mousedown", q);
        d.bind(this.__field_knob, "mousedown", q);
        d.bind(this.__hue_field, "mousedown", function(t) {
            o(t);
            d.bind(window, "mousemove", o);
            d.bind(window, "mouseup", k)
        });

        function q(t) {
            l(t);
            d.bind(window, "mousemove", l);
            d.bind(window, "mouseup", s)
        }

        function s() {
            d.unbind(window, "mousemove", l);
            d.unbind(window, "mouseup", s)
        }

        function j() {
            var t = b(this.value);
            if (t !== false) {
                p.__color.__state = t;
                p.setValue(p.__color.toOriginal())
            } else {
                this.value = p.__color.toString()
            }
        }

        function k() {
            d.unbind(window, "mousemove", o);
            d.unbind(window, "mouseup", k)
        }
        this.__saturation_field.appendChild(n);
        this.__selector.appendChild(this.__field_knob);
        this.__selector.appendChild(this.__saturation_field);
        this.__selector.appendChild(this.__hue_field);
        this.__hue_field.appendChild(this.__hue_knob);
        this.domElement.appendChild(this.__input);
        this.domElement.appendChild(this.__selector);
        this.updateDisplay();

        function l(y) {
            y.preventDefault();
            var t = d.getWidth(p.__saturation_field);
            var z = d.getOffset(p.__saturation_field);
            var x = (y.clientX - z.left + document.body.scrollLeft) / t;
            var u = 1 - (y.clientY - z.top + document.body.scrollTop) / t;
            if (u > 1) {
                u = 1
            } else {
                if (u < 0) {
                    u = 0
                }
            }
            if (x > 1) {
                x = 1
            } else {
                if (x < 0) {
                    x = 0
                }
            }
            p.__color.v = u;
            p.__color.s = x;
            p.setValue(p.__color.toOriginal());
            return false
        }

        function o(v) {
            v.preventDefault();
            var u = d.getHeight(p.__hue_field);
            var w = d.getOffset(p.__hue_field);
            var t = 1 - (v.clientY - w.top + document.body.scrollTop) / u;
            if (t > 1) {
                t = 1
            } else {
                if (t < 0) {
                    t = 0
                }
            }
            p.__color.h = t * 360;
            p.setValue(p.__color.toOriginal());
            return false
        }
    };
    e.superclass = c;
    f.extend(e.prototype, c.prototype, {
        updateDisplay: function() {
            var k = b(this.getValue());
            if (k !== false) {
                var j = false;
                f.each(a.COMPONENTS, function(n) {
                    if (!f.isUndefined(k[n]) && !f.isUndefined(this.__color.__state[n]) && k[n] !== this.__color.__state[n]) {
                        j = true;
                        return {}
                    }
                }, this);
                if (j) {
                    f.extend(this.__color.__state, k)
                }
            }
            f.extend(this.__temp.__state, this.__color.__state);
            this.__temp.a = 1;
            var m = (this.__color.v < 0.5 || this.__color.s > 0.5) ? 255 : 0;
            var l = 255 - m;
            f.extend(this.__field_knob.style, {
                marginLeft: 100 * this.__color.s - 7 + "px",
                marginTop: 100 * (1 - this.__color.v) - 7 + "px",
                backgroundColor: this.__temp.toString(),
                border: this.__field_knob_border + "rgb(" + m + "," + m + "," + m + ")"
            });
            this.__hue_knob.style.marginTop = (1 - this.__color.h / 360) * 100 + "px";
            this.__temp.s = 1;
            this.__temp.v = 1;
            g(this.__saturation_field, "left", "#fff", this.__temp.toString());
            f.extend(this.__input.style, {
                backgroundColor: this.__input.value = this.__color.toString(),
                color: "rgb(" + m + "," + m + "," + m + ")",
                textShadow: this.__input_textShadow + "rgba(" + l + "," + l + "," + l + ",.7)"
            })
        }
    });
    var h = ["-moz-", "-o-", "-webkit-", "-ms-", ""];

    function g(m, k, l, j) {
        m.style.background = "";
        f.each(h, function(n) {
            m.style.cssText += "background: " + n + "linear-gradient(" + k + ", " + l + " 0%, " + j + " 100%); "
        })
    }

    function i(j) {
        j.style.background = "";
        j.style.cssText += "background: -moz-linear-gradient(top,  #ff0000 0%, #ff00ff 17%, #0000ff 34%, #00ffff 50%, #00ff00 67%, #ffff00 84%, #ff0000 100%);";
        j.style.cssText += "background: -webkit-linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);";
        j.style.cssText += "background: -o-linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);";
        j.style.cssText += "background: -ms-linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);";
        j.style.cssText += "background: linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);"
    }
    return e
})(dat.controllers.Controller, dat.dom.dom, dat.color.Color = (function(b, h, c, g) {
    var a = function() {
        this.__state = b.apply(this, arguments);
        if (this.__state === false) {
            throw "Failed to interpret color arguments"
        }
        this.__state.a = this.__state.a || 1
    };
    a.COMPONENTS = ["r", "g", "b", "h", "s", "v", "hex", "a"];
    g.extend(a.prototype, {
        toString: function() {
            return c(this)
        },
        toOriginal: function() {
            return this.__state.conversion.write(this)
        }
    });
    f(a.prototype, "r", 2);
    f(a.prototype, "g", 1);
    f(a.prototype, "b", 0);
    i(a.prototype, "h");
    i(a.prototype, "s");
    i(a.prototype, "v");
    Object.defineProperty(a.prototype, "a", {
        get: function() {
            return this.__state.a
        },
        set: function(j) {
            this.__state.a = j
        }
    });
    Object.defineProperty(a.prototype, "hex", {
        get: function() {
            if (!this.__state.space !== "HEX") {
                this.__state.hex = h.rgb_to_hex(this.r, this.g, this.b)
            }
            return this.__state.hex
        },
        set: function(j) {
            this.__state.space = "HEX";
            this.__state.hex = j
        }
    });

    function f(l, k, j) {
        Object.defineProperty(l, k, {
            get: function() {
                if (this.__state.space === "RGB") {
                    return this.__state[k]
                }
                e(this, k, j);
                return this.__state[k]
            },
            set: function(m) {
                if (this.__state.space !== "RGB") {
                    e(this, k, j);
                    this.__state.space = "RGB"
                }
                this.__state[k] = m
            }
        })
    }

    function i(k, j) {
        Object.defineProperty(k, j, {
            get: function() {
                if (this.__state.space === "HSV") {
                    return this.__state[j]
                }
                d(this);
                return this.__state[j]
            },
            set: function(l) {
                if (this.__state.space !== "HSV") {
                    d(this);
                    this.__state.space = "HSV"
                }
                this.__state[j] = l
            }
        })
    }

    function e(j, l, k) {
        if (j.__state.space === "HEX") {
            j.__state[l] = h.component_from_hex(j.__state.hex, k)
        } else {
            if (j.__state.space === "HSV") {
                g.extend(j.__state, h.hsv_to_rgb(j.__state.h, j.__state.s, j.__state.v))
            } else {
                throw "Corrupted color state"
            }
        }
    }

    function d(k) {
        var j = h.rgb_to_hsv(k.r, k.g, k.b);
        g.extend(k.__state, {
            s: j.s,
            v: j.v
        });
        if (!g.isNaN(j.h)) {
            k.__state.h = j.h
        } else {
            if (g.isUndefined(k.__state.h)) {
                k.__state.h = 0
            }
        }
    }
    return a
})(dat.color.interpret, dat.color.math = (function() {
    var a;
    return {
        hsv_to_rgb: function(g, m, k) {
            var e = Math.floor(g / 60) % 6;
            var i = g / 60 - Math.floor(g / 60);
            var d = k * (1 - m);
            var b = k * (1 - (i * m));
            var l = k * (1 - ((1 - i) * m));
            var j = [
                [k, l, d],
                [b, k, d],
                [d, k, l],
                [d, b, k],
                [l, d, k],
                [k, d, b]
            ][e];
            return {
                r: j[0] * 255,
                g: j[1] * 255,
                b: j[2] * 255
            }
        },
        rgb_to_hsv: function(k, j, d) {
            var e = Math.min(k, j, d),
                c = Math.max(k, j, d),
                l = c - e,
                i, f;
            if (c != 0) {
                f = l / c
            } else {
                return {
                    h: NaN,
                    s: 0,
                    v: 0
                }
            }
            if (k == c) {
                i = (j - d) / l
            } else {
                if (j == c) {
                    i = 2 + (d - k) / l
                } else {
                    i = 4 + (k - j) / l
                }
            }
            i /= 6;
            if (i < 0) {
                i += 1
            }
            return {
                h: i * 360,
                s: f,
                v: c / 255
            }
        },
        rgb_to_hex: function(f, e, c) {
            var d = this.hex_with_component(0, 2, f);
            d = this.hex_with_component(d, 1, e);
            d = this.hex_with_component(d, 0, c);
            return d
        },
        component_from_hex: function(c, b) {
            return (c >> (b * 8)) & 255
        },
        hex_with_component: function(c, b, d) {
            return d << (a = b * 8) | (c & ~(255 << a))
        }
    }
})(), dat.color.toString, dat.utils.common), dat.color.interpret, dat.utils.common), dat.utils.requestAnimationFrame = (function() {
    return window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(b, a) {
        window.setTimeout(b, 1000 / 60)
    }
})(), dat.dom.CenteredDiv = (function(d, c) {
    var b = function() {
        this.backgroundElement = document.createElement("div");
        c.extend(this.backgroundElement.style, {
            backgroundColor: "rgba(0,0,0,0.8)",
            top: 0,
            left: 0,
            display: "none",
            zIndex: "1000",
            opacity: 0,
            WebkitTransition: "opacity 0.2s linear"
        });
        d.makeFullscreen(this.backgroundElement);
        this.backgroundElement.style.position = "fixed";
        this.domElement = document.createElement("div");
        c.extend(this.domElement.style, {
            position: "fixed",
            display: "none",
            zIndex: "1001",
            opacity: 0,
            WebkitTransition: "-webkit-transform 0.2s ease-out, opacity 0.2s linear"
        });
        document.body.appendChild(this.backgroundElement);
        document.body.appendChild(this.domElement);
        var e = this;
        d.bind(this.backgroundElement, "click", function() {
            e.hide()
        })
    };
    b.prototype.show = function() {
        var e = this;
        this.backgroundElement.style.display = "block";
        this.domElement.style.display = "block";
        this.domElement.style.opacity = 0;
        this.domElement.style.webkitTransform = "scale(1.1)";
        this.layout();
        c.defer(function() {
            e.backgroundElement.style.opacity = 1;
            e.domElement.style.opacity = 1;
            e.domElement.style.webkitTransform = "scale(1)"
        })
    };
    b.prototype.hide = function() {
        var f = this;
        var e = function() {
            f.domElement.style.display = "none";
            f.backgroundElement.style.display = "none";
            d.unbind(f.domElement, "webkitTransitionEnd", e);
            d.unbind(f.domElement, "transitionend", e);
            d.unbind(f.domElement, "oTransitionEnd", e)
        };
        d.bind(this.domElement, "webkitTransitionEnd", e);
        d.bind(this.domElement, "transitionend", e);
        d.bind(this.domElement, "oTransitionEnd", e);
        this.backgroundElement.style.opacity = 0;
        this.domElement.style.opacity = 0;
        this.domElement.style.webkitTransform = "scale(1.1)"
    };
    b.prototype.layout = function() {
        this.domElement.style.left = window.innerWidth / 2 - d.getWidth(this.domElement) / 2 + "px";
        this.domElement.style.top = window.innerHeight / 2 - d.getHeight(this.domElement) / 2 + "px"
    };

    function a(f) {
        console.log(f)
    }
    return b
})(dat.dom.dom, dat.utils.common), dat.dom.dom, dat.utils.common);
