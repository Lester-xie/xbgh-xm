(function ($, cmp) {
    var $item = $(".menu-list-item"),
        modalName = "",
        close = ".fa-minus-circle";

    var list = {
        form: {},
        table: {}
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

            self.fExport(self);

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
                list = {
                    form: {},
                    table: {}
                }
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
                        that.fTable();
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
                $condition = $(".gen-condition");
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
                //生成uuid
                var uuid = cmp.genUuid() + cmp.genUuid();
                $condition.append(ele.outerHTML);

                $condition.find("[data-widget]:last").attr("data-uuid", uuid);
                that.fBindToElem(ele, uuid);
                that.fDelete();
            }
        },

        //给在条件区域拖动的元素绑定事件
        fBindToElem: function (e, uuid) {
            var $attributeWrap = $(".attribute-wrap"),
                widget = $(e).attr("data-widget"),
                $current, currentUuid;
            switch (widget) {
                case "radio":
                    list.form[uuid] = {
                        label: "label",
                        name: "",
                        content: [],
                        widget: "radio"
                    };
                    break;
                case "checkbox":
                    list.form[uuid] = {
                        label: "label",
                        name: "",
                        content: [],
                        widget: "checkbox"
                    };
                    break;
                case "text":
                    list.form[uuid] = {
                        type: "text",
                        name: ""
                    };
                    break;
                case "textLabel":
                    list.form[uuid] = {
                        label: "label",
                        type: "text",
                        name: ""
                    };
                    break;
                case "textarea":
                    list.form[uuid] = {
                        label: "label",
                        name: "",
                        rows: "",
                        count: "",
                        widget: "textarea"
                    };
                    break;
                case "select":
                    list.form[uuid] = {
                        name: "",
                        widget: "select"
                    };
                    break;
                case "selectLabel":
                    list.form[uuid] = {
                        label: "label",
                        name: "",
                        widget: "select"
                    };
                    break;
                case "timeSingle":
                    list.form[uuid] = {
                        label: "时间",
                        name: "",
                        placeholder: "",
                        widget: "datePicker"
                    };
                    break;
                case "time":
                    list.form[uuid] = {
                        label: "时间",
                        startTimeId: "",
                        startName: "",
                        startPlaceholder: "",
                        endTimeId: "",
                        endName: "",
                        endPlaceholder: "",
                        widget: "datePicker"
                    };
                    break;
                case "button":
                    list.form[uuid] = {
                        text: "按钮",
                        api: "",
                        buttonType: "",
                        changeClass: "",
                        class: "",
                        plug: "",
                        widgetType: "button"
                    };
                    break;
                case "uploader":
                    list.form[uuid] = {
                        text: "上传图片",
                        name: "",
                        fdfsTest: "",
                        fdfsOnline: "",
                        serverTest: "",
                        serverOnline: ""
                    };
                    break;
            }
            //添加选定控件的样式骑自行车
            $(".gen-condition [data-widget]").on("click", function () {
                var uuid = $(this).attr("data-uuid");
                $(".attribute-wrap > div").hide();
                $(this).addClass("gen-active").siblings().removeClass("gen-active");
                for (var i in list.form[uuid]) {
                    $attributeWrap.find("." + i).show().find("input,select").val(list.form[uuid][i]);
                }
                $attributeWrap.find("div:visible input")[0].focus();
                if ($(this).find(close).length == 0) {
                    $(this).append('<i class="fa fa-minus-circle" style="position:absolute;top:-10px;right:-12px;color:red"></i>')
                } else {
                    $(this).find(close).show();
                }
                $(this).siblings().find(close).hide();
            }).click();

            //输入框失去焦点给数组赋值
            $attributeWrap.on("blur", "input,select", function () {
                if ($(".gen-active")[0]) {
                    $current = $(".gen-active");
                    currentUuid = $current.attr("data-uuid");
                    var currentWidget = $(this).closest("div").attr("class"),
                        currentSpan = $current.find("span"),
                        currentButton = $current.find("button");
                    list.form[currentUuid][currentWidget] = $(this).val();
                    if (currentWidget == "label") {
                        currentSpan.text($(this).val());
                    } else if (currentWidget == "text") {
                        currentButton.text($(this).val());
                    }
                }
            });

            //设置按钮的类型change事件
            $attributeWrap.on("change", ".buttonType select", function () {
                var text = $(this).find(":selected").text();
                list.form[$current.attr("data-uuid")].text = text;
                $attributeWrap.find(".text input").eq(0).val(text);
                $current.find("button").text(text);
                if ($(this).val() == "append") {
                    list.form[$current.attr("data-uuid")].plug = "modal-append";
                }
            });

            //设置按钮的颜色
            $attributeWrap.on("click", "[data-class]", function () {
                list.form[currentUuid].class = $(this).attr("data-class");
                $current.find("button").attr("class", $(this).attr("data-class") + " button btn-xs");
            })
        },

        //条件区域删除控件
        fDelete: function () {
            $(".gen-condition").on("click", close, function () {
                var widget = $(this).closest("[data-widget]");
                widget.remove();
                $(".attribute-wrap > div").hide();
                delete list.form[widget.attr("data-uuid")];
            })
        },

        //表格事件绑定
        fTable: function () {
            var $condition = $(".gen-condition"),
                $attributeWrap = $(".attribute-wrap");
            $(".gen-table input").on("focus", function () {
                $condition.find(".gen-active").removeClass("gen-active").find(close).hide();
                $attributeWrap.find(">div").hide();
                $(".cols").show();
            }).on("blur", function () {
                $(".cols").hide();
            });
            $attributeWrap.on("change", ".cols select", function () {
                var cols = $(this).val();
                var $tHeadTr = $(".tHeadTr"),
                    $tBodyTr = $('.tBodyTr');
                $tHeadTr.html("");
                $tBodyTr.html("");
                for (var i = 0; i < cols; i++) {
                    $tHeadTr.append('<th><input type="text"></th>');
                    if (i == cols - 1) {
                        $tBodyTr.append('<td class="text-center"><button class="append">+</button></td>');
                    } else {
                        $tBodyTr.append('<td>***</td>');
                    }
                }
            });

            $(document).on("click", ".append", function () {
                var $td = $(this).closest("td");
                $td.prepend('<span draggable="true" data-widget="button">' +
                    '<button class="btn btn-xs button">按钮</button></span>&emsp;')
            });
            $("td").on("click", "[data-widget]", function () {
                $(this).addClass("gen-active").siblings().removeClass("gen-active");
                if ($(this).find(close).length == 0) {
                    $(this).append('<i class="fa fa-minus-circle" style="position:absolute;top:-10px;right:-12px;color:red"></i>')
                } else {
                    $(this).find(close).show();
                }
            });

            $()

        },

        //导出json,发送请求
        fExport: function (that) {
            $(".export").on("click", function () {
                that.fFormatList();
            });
        },

        //格式化list
        fFormatList: function () {
            var form = [],
                options = [];
            for (var i in list.form) {
                if (!list.form[i].widgetType) {
                    form.push(list.form[i])
                } else {
                    options.push(list.form[i]);
                }
            }

            var data = {
                "title": $(".gen-title").val(),
                "wrap": form,
                "options": options
            };
            console.log(data);
        }
    };

    $(function () {
        new Index();
    });
})(jQuery, window.utils);