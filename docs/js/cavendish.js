// Generated by CoffeeScript 1.3.3
(function() {
  var $, Cavendish, CavendishEventsPlugin, CavendishPagerPlugin, CavendishPanPlugin, CavendishPlayer, CavendishPlugin, defaults, plugins,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  $ = jQuery;

  Cavendish = (function() {

    function Cavendish(show, options) {
      this.show = show;
      this.options = options;
      this.slides = this.show.find(this.options.slideSelector);
      if (this.slides.length > 0) {
        this.initialize();
      }
    }

    Cavendish.prototype.initialize = function() {
      var plugin, plugin_name, _i, _len, _ref;
      this.plugins = (function() {
        var _i, _len, _ref, _results;
        _ref = this.options.use_plugins;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          plugin_name = _ref[_i];
          _results.push(new plugins[plugin_name](this));
        }
        return _results;
      }).call(this);
      this.last = $();
      this.length = this.slides.length;
      this.show.data('cavendish', this).addClass('cavendish-slideshow');
      _ref = this.plugins;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        plugin = _ref[_i];
        plugin.setup();
      }
      this.goto(0);
      return this.slides.not(this.current).addClass('cavendish-before');
    };

    Cavendish.prototype.next = function() {
      var index;
      index = this.index + 1;
      if (index >= this.length) {
        index = 0;
      }
      return this.goto(index);
    };

    Cavendish.prototype.prev = function() {
      var index;
      index = this.index - 1;
      if (index < 0) {
        index = this.slides.length - 1;
      }
      return this.goto(index);
    };

    Cavendish.prototype.goto = function(index) {
      var plugin, _i, _len, _ref, _results,
        _this = this;
      if (!(this.slides[index] != null)) {
        return;
      }
      this.index = index;
      if (this.current != null) {
        this.last = this.current;
      }
      this.current = this.slides.eq(this.index);
      this.slides.removeClass('cavendish-onstage cavendish-before cavendish-after cavendish-left cavendish-right');
      this.last.addClass('cavendish-after');
      this.current.addClass('cavendish-onstage');
      this.slides.each(function(index, slide) {
        if (index < _this.index) {
          return $(slide).addClass('cavendish-left');
        } else if (index > _this.index) {
          return $(slide).addClass('cavendish-right');
        }
      });
      this.slides.not(this.last).not(this.current).addClass('cavendish-before');
      _ref = this.plugins;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        plugin = _ref[_i];
        _results.push(plugin.transition());
      }
      return _results;
    };

    return Cavendish;

  })();

  CavendishPlayer = (function(_super) {

    __extends(CavendishPlayer, _super);

    function CavendishPlayer() {
      return CavendishPlayer.__super__.constructor.apply(this, arguments);
    }

    CavendishPlayer.prototype.initialize = function() {
      var _this = this;
      CavendishPlayer.__super__.initialize.apply(this, arguments);
      if (this.options.player_pause) {
        this.show.hover((function() {
          return _this.stop();
        }), (function() {
          return _this.start();
        }));
      }
      if (this.options.player_start) {
        return this.start();
      }
    };

    CavendishPlayer.prototype.start = function() {
      var _this = this;
      this.show.addClass('cavendish-playing');
      return this.timeout = setInterval((function() {
        return _this.next();
      }), this.options.slideTimeout);
    };

    CavendishPlayer.prototype.stop = function() {
      this.show.removeClass('cavendish-playing');
      return clearInterval(this.timeout);
    };

    return CavendishPlayer;

  })(Cavendish);

  CavendishPlugin = (function() {

    function CavendishPlugin(cavendish) {
      this.cavendish = cavendish;
    }

    CavendishPlugin.prototype.setup = function() {};

    CavendishPlugin.prototype.transition = function() {};

    return CavendishPlugin;

  })();

  CavendishEventsPlugin = (function(_super) {

    __extends(CavendishEventsPlugin, _super);

    function CavendishEventsPlugin() {
      return CavendishEventsPlugin.__super__.constructor.apply(this, arguments);
    }

    CavendishEventsPlugin.prototype.setup = function() {
      return this.cavendish.show.trigger('cavendish-setup', [this.cavendish]);
    };

    CavendishEventsPlugin.prototype.transition = function() {
      return this.cavendish.show.trigger('cavendish-transition', [this.cavendish]);
    };

    return CavendishEventsPlugin;

  })(CavendishPlugin);

  CavendishPagerPlugin = (function(_super) {

    __extends(CavendishPagerPlugin, _super);

    function CavendishPagerPlugin() {
      return CavendishPagerPlugin.__super__.constructor.apply(this, arguments);
    }

    CavendishPagerPlugin.prototype.setup = function() {
      var _this = this;
      this.pager = $('.cavendish-pager');
      return this.pager.find('a').each(function(index, el) {
        return $(el).click(function() {
          return _this.cavendish.goto(index);
        });
      });
    };

    CavendishPagerPlugin.prototype.transition = function() {
      return this.pager.find('li').removeClass('active').eq(this.cavendish.index).addClass('active');
    };

    return CavendishPagerPlugin;

  })(CavendishPlugin);

  CavendishPanPlugin = (function(_super) {

    __extends(CavendishPanPlugin, _super);

    function CavendishPanPlugin() {
      return CavendishPanPlugin.__super__.constructor.apply(this, arguments);
    }

    CavendishPanPlugin.prototype.setup = function() {
      var _this = this;
      this.background = $('.cavendish-background ol.slides');
      return this.background.children().each(function(index, el) {
        return $(el).css('left', index * 100 + '%');
      });
    };

    CavendishPanPlugin.prototype.transition = function() {
      return this.background.css('left', (this.cavendish.index * -100) + '%');
    };

    return CavendishPanPlugin;

  })(CavendishPlugin);

  $.fn.cavendish = function(options) {
    var cavendish;
    if (typeof options !== 'string') {
      options = $.extend({}, defaults, options);
      return this.each(function() {
        if (options.player) {
          return new CavendishPlayer($(this), options);
        } else {
          return new Cavendish($(this), options);
        }
      });
    } else {
      cavendish = $(this).data('cavendish');
      if (cavendish != null) {
        switch (options) {
          case 'next':
            cavendish.next();
            break;
          case 'prev':
            cavendish.prev();
            break;
          case 'cavendish':
            return cavendish;
        }
      }
      return this;
    }
  };

  defaults = $.fn.cavendish.defaults = {
    player: true,
    player_start: true,
    player_pause: true,
    slideSelector: '> ol > li',
    slideTimeout: 2000,
    use_plugins: []
  };

  plugins = $.fn.cavendish.plugins = {
    events: CavendishEventsPlugin,
    pager: CavendishPagerPlugin,
    pan: CavendishPanPlugin
  };

}).call(this);
