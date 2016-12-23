(function ($) {
    var $item = $(".menu-list-item"),
        modalName = "";

    var global = {
        form: [],
        table: []
    };

    function Index() {
        this.init();
    }

    Index.prototype = {
        init: function () {
            this.bindEvents();
        },
        bindEvents: function () {
            var self = this;

            self.fMenuChoose().fModalChoose(self);
        },

        //菜单选择
        fMenuChoose: function () {
            $item.on("click", function () {
                var self = this;
                ["#col1", "#col2", "#col3"].map(function (i) {
                    $(self).attr("href") != i && $(i).collapse('hide');
                });
                $item.removeClass("active");
                $(self).addClass("active");
            });
            return this;
        },

        //模板选择
        fModalChoose: function (that) {
            //模板折叠联动
            $(document).on("click", ".template-title", function () {
                $(".choose-modal").trigger("click");
                if (!$item.is(".active")) $item[0].click();
                $(".gen").show();
            });
            $(document).on("click", ".choose-modal", function () {
                var self = this;
                if ($(self).attr("data-show") == "true") {
                    $(self).attr("data-show", false).find("i").attr("class", "fa fa-angle-double-right");
                    $(".template-wrap").hide();
                    $(".gen").show();
                } else {
                    $(self).attr("data-show", true).find("i").attr("class", "fa fa-angle-double-down");
                    $(".template-wrap").show();
                    $(".gen").hide();
                }
            });

            //模板内容切换
            $(document).on("click", "[data-type]", function () {
                var self = this,
                    $gen = $(".gen"),
                    modalType = $(self).attr("data-type"),
                    $chose = $(".chose");
                modalName = modalType;
                switch (modalType) {
                    case "list":
                        $gen.html($("#list").html());
                        $chose.text("-列表页");
                        that.fDrop(that);
                        break;
                    case "append":
                        $gen.html($("#append").html());
                        $chose.text("-新增页");
                        break;
                }
            });
        },

        //条件区域拖动事件
        fDrop: function (that) {
            var $widget = $("[data-widget]"),
                $condition = $(".gen-condition"),
                ele = null;
            for (var i = 0; i < $widget.length; i++) {
                //开始拖动
                $widget[i].ondragstart = function () {
                    ele = this;
                };
            }
            //经过目标元素区域
            $condition[0].ondragover = function (e) {
                e.preventDefault();
            };
            //拖动结束
            $condition[0].ondrop = function () {
                $condition.append(ele.outerHTML);
                that.fBindToElem(ele)
            }
        },

        //给拖动的元素绑定事件
        fBindToElem: function (e) {
            var $wrap = $(".attribute-wrap");
            switch ($(e).attr("data-widget")) {
                case "radio":
                    $wrap.append();
            }
        }

    };

    $(function () {
        new Index();
    });
})(jQuery);