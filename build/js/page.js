$(document).ready(function () {
    $page.init();
});

var $page = {
    init0: function (urlAjax, urlBookSuccess) {
        this.waitPanel = $("#global-wait");
        this.urlAjax = urlAjax;
        this.urlBookSuccess = urlBookSuccess;
    },

    init: function () {
        var that = this;

        $("input.need-valid").blur(function (event) {
            $valid.validateInput($(event.currentTarget));
        });
        $("select.need-valid").blur(function (event) {
            $valid.validateSelect($(event.currentTarget));
        });
        $("select.need-valid").change(function (event) {
            $valid.validateSelect($(event.currentTarget));
        });

        $(".part-lookup button").click(function () {
            that.lookup();
        });

        $(".part-sidebar button[action='lookup-again']").click(function () {
            that.lookupAgain();
        });

        $("#service").change(function () {
            that.afterChangeService();
        });

        $(".part-calendar input").change(function (event) {
            var input = $(event.currentTarget),
                checked = input.prop("checked");

            if (checked) {
                $(".part-calendar input").prop("checked", false);
                input.prop("checked", true);
            }
        });
        $(".part-calendar input").prop("checked", false);

        $("#mot").change(function () {
            that.afterChangeMot();
        });
        $("#mot").prop("checked", false);

        $("#summer-health").change(function () {
            that.afterChangeSummerHealth();
        });
        $("#summer-health").prop("checked", false);

        $("input[name='additional_service[]']").change(function (event) {
            that.afterChangeAddSvc(event);
        });
        $("input[name='additional_service[]']").prop("checked", false);

        $(".part-customer-service input").click(function () {
            that.afterChangeCustomService();
        });
        this.afterChangeCustomService();

        $("button[action='book-service']").click(function () {
            that.bookService();
        });
    },

    showSidebar: function () {
        var sidebar = $('#sidebar');

            initialize = function () {
                var st = sidebar.offset().top,
                    sfunc = function () {
                        var wt = $(window).scrollTop(),
                            ww = $(window).width(),
                            wh = $(window).height();

                        sidebar.toggleClass("fixed", ww >= 992 && wt >= st);

                        if (sidebar.hasClass("fixed")) {
                            sidebar.css("max-height", wh + 1 + "px");
                        } else {
                            sidebar.css("max-height", "unset");
                            st = sidebar.offset().top;
                        }
                    };

                sfunc();

                $(window).scroll(function () {
                    sfunc();
                });
                $(window).resize(function () {
                    sfunc();
                });
                $(sidebar).resize(function () {
                    sfunc();
                });
            };

        /*$(".offsets").removeClass("offset-lg-2");*/

        $(".part-sidebar").fadeIn("fast", function () {
            if (sidebar.attr("initialized") === undefined) {
                sidebar.attr("initialized", "");
                initialize();
            }
        });
    },

    showCalendar: function () {
        var calendar = $(".calendar"),
            initialize = function () {
                new Swiper('.swiper-container', {
                    loop: false,
                    slidesPerView: 7,
                    slidesPerGroup: 7,
                    simulateTouch: false,
                    navigation: {
                        nextEl: '.swiper-button-next',
                        prevEl: '.swiper-button-prev'
                    },
                    breakpoints: {
                        360: { slidesPerView: 3, slidesPerGroup: 3 },
                        480: { slidesPerView: 5, slidesPerGroup: 5 }
                    }
                });
            };

        $(".part-calendar").fadeIn("fast", function () {
            if (calendar.attr("initialized") === undefined) {
                calendar.attr("initialized", "");
                initialize();
            }
        });
    },

    showOnlyModal: function (modal, options) {
        //show modal after ensure that other modals are closed
        var func = function () {
            if ($(document.body).hasClass("modal-open")) {
                window.setTimeout(func, 100);
            } else {
                modal.modal(options);
            }
        };

        func();
    },

    beginWait: function () {
        this.waitPanel.fadeIn("fast");
    },

    endWait: function () {
        this.waitPanel.fadeOut("fast");
    },

    lookup: function () {
        var that = this,
            part = $(".part-lookup"),
            partDet = $(".part-vehicle-details"),
            getInputStr = function (name) {
                return part.find("input[name='" + name + "']").val().trim();
            },
            getInputNumber = function (name) {
                var str = getInputStr(name);

                if (str === "") {
                    return null;
                } else {
                    return Number(str);
                }
            },
            getSelectStr = function (name) {
                return part.find("select[name='" + name + "']").val().trim();
            },
            regno = getInputStr("regno").toUpperCase(),
            mileage = getInputNumber("mileage"),
            servicePlan = getSelectStr("service_plan"),
            onError = function (err) {
                console.log(err);
                $page.showOnlyModal($("#modal-lookup-error"));
            },
            onComplete = function (data) {
                var regDate = data.regDate,
                    regDateStr = regDate === null ? "" : $dateworks.jsonToLocalDateStr(regDate),
                    setInput = function (name, value) {
                        partDet.find("input[name='" + name + "']").val(value);
                    },
                    services = $datatables.dataTableToArray(data.services),
                    cService = $("#service"),
                    i, item, domOption;

                //details

                partDet.find("input").val("");

                setInput("regno", regno);
                setInput("mileage", mileage);
                setInput("service_plan", data.servicePlan);
                setInput("desc", data.desc);
                setInput("regdate", regDateStr);

                setInput("manuf", data.manuf);
                setInput("model", data.model);
                setInput("fuel", data.fuel);
                setInput("cc", data.cc);

                //service

                cService.children().remove(":not([value=''])");
                $(".part-service-desc").hide();

                for (i = 0; i < services.length; i++) {
                    item = services[i];

                    domOption = $dom.append(cService, $tpl.option)
                        .val(item.name)
                        .text(item.name + " (" + item.no + ")" + (item.selected ? " - Recommended" : ""))
                        .attr("price", item.value);

                    if (item.selected) {
                        domOption.attr("preferable", "");
                    }
                }

                //show-hide

                part.fadeOut("fast");
                that.showSidebar();

                $(".part-after-lookup").slideDown("fast");

                that.showCalendar();
            };

        part.find("input.need-valid").each(function () {
            $valid.validateInput($(this));
        });
        part.find("select.need-valid").each(function () {
            $valid.validateSelect($(this));
        });

        if (part.find("input.err, select.err").length > 0) {
            return;
        }

        $.ajax({
            url: $page.urlAjax.replace("_tpl_", "_B62B4767_LookupVehicle"),
            data: {
                regno,
                mileage,
                servicePlan
            },
            type: "POST",
            async: true,
            beforeSend: function () { $page.beginWait(); },
            complete: function () { $page.endWait(); },
            success: function (result) {
                if (result.error !== undefined && result.error !== "") {
                    onError(result.error);
                } else {
                    onComplete(result);
                }
            },
            error: function (xhr) {
                onError(xhr.statusText);
            },
            timeout: 0
        });
    },

    lookupAgain: function () {
        /*$(".offsets").addClass("offset-lg-2");*/
        $(".part-after-lookup, .part-calendar").slideUp("fast");
        $(".part-lookup").slideDown("fast");
        $(".part-sidebar").fadeOut("fast");
    },

    afterChangeService: function () {
        var service = $("#service"),
            value = service.val(),
            price = service.children("[value='" + value + "']").attr("price"),
            parts = $(".part-service-desc"),
            partNew = $(".part-service-desc[name='" + value + "']"),
            domTable = $(".table-summary-items"),
            tr, td;

        domTable.find("tr[data-type='service']").remove();

        if (partNew.length === 0) {
            parts.slideUp("fast");
        } else {
            parts.hide();
            partNew.fadeIn("fast");

            tr = $dom.append(domTable, $tpl.tr).attr("data-type", "service");

            $dom.append(tr, $tpl.td).text(value);
            td = $dom.append(tr, $tpl.td).text("£" + $moneyworks.toMoney(price));

            $dom.append(td, $tpl.inputHidden).val(price);
        }

        this.summaryCountTotal();
    },

    summaryCountTotal: function () {
        var inputs = $(".table-summary-items input"),
            sum = 0;

        inputs.each(function () {
            sum += Number($(this).val());
        });

        $(".data-summary-total").text("£" + $moneyworks.toMoney(sum));
    },

    afterChange_Level_1: function (id, title, price) {
        var checked = $("#" + id).prop("checked"),
            domTable = $(".table-summary-items"),
            tr, td;

        domTable.find("tr[data-type='" + id + "']").remove();

        if (checked) {
            tr = $dom.append(domTable, $tpl.tr).attr("data-type", id);

            $dom.append(tr, $tpl.td).text(title);
            td = $dom.append(tr, $tpl.td).text("£" + $moneyworks.toMoney(price));

            $dom.append(td, $tpl.inputHidden).val(price);
        }

        this.summaryCountTotal();
    },

    afterChangeMot: function () {
        this.afterChange_Level_1("mot", "MOT", 27.43);
    },

    afterChangeSummerHealth: function () {
        this.afterChange_Level_1("summer-health", "Summer Health Check & Treat", 29);
    },

    afterChangeAddSvc: function (event) {
        var item = $(event.currentTarget),
            checked = item.prop("checked"),
            val = item.val(),
            price = Number(item.attr("data-price")),
            domTable = $(".table-summary-items"),
            tr, td;

        domTable.find("tr[data-type='addsvc'][data-name='" + val + "']").remove();

        if (checked) {
            tr = $dom.append(domTable, $tpl.tr)
                .attr("data-type", "addsvc")
                .attr("data-name", val);

            $dom.append(tr, $tpl.td).text(val);
            td = $dom.append(tr, $tpl.td).text("£" + $moneyworks.toMoney(price));

            $dom.append(td, $tpl.inputHidden).val(price);
        }

        this.summaryCountTotal();
    },

    afterChangeCustomService: function () {
        var apx = $(".part-customer-service input:checked").attr("apx"),
            apxColDel = $(".part-col-del");

        if (apx === undefined || apx !== "col-del") {
            apxColDel.slideUp("fast");
        } else {
            apxColDel.slideDown("fast");
        }
    },

    bookService: function () {
        var partClient = $(".part-client"),
            getClientPar = function (name) {
                return partClient.find("input[name='" + name + "']").val();
            },
            fullName = getClientPar("full_name"),
            email = getClientPar("email"),
            phone = getClientPar("phone"),
            partCalendar = $(".part-calendar"),
            prefDate = partCalendar.find("input:checked").val(),
            prefDateDate,
            prefDateStr,
            partBranch = $(".part-branch"),
            branchInput = partBranch.find("input[name='branch']:checked"),
            branch = branchInput.val(),
            branchDesc = branchInput.siblings("label").text(),
            partVehicle = $(".part-vehicle-details"),
            getVehiclePar = function (name) {
                return partVehicle.find("input[name='" + name + "']").val();
            },
            partColDel = $(".part-col-del"),
            request,
            addLine = "-------------------------\r\n",
            addLineSmall = "-----\r\n",
            addInfo = "",
            onError = function (err) {
                console.log(err);
                $page.endWait();
                $page.showOnlyModal($("#modal-book-error"));
            },
            anyElse = $("#else").val();

        partClient.find("input.need-valid").each(function () {
            $valid.validateInput($(this));
        });

        if (partClient.find("input.err").length > 0) {
            var top = 0;

            partClient.find("input.err").each(function () {
                var item = $(this),
                    itemTop = item.offset().top;

                if (top === 0 || top > itemTop) {
                    top = itemTop;
                }
            });

            $('body,html').animate({ scrollTop: top < 60 ? 0 : top - 60 }, 1500);

            return;
        }

        if (partColDel.is(":visible")) {
            partColDel.find("input.need-valid").each(function () {
                $valid.validateInput($(this));
            });

            if (partColDel.find("input.err").length > 0) {
                $("#modal-no-col-del").modal();
                return;
            }
        }

        if (prefDate === undefined) {
            $("#modal-no-prefdate").modal();
            return;
        }

        prefDateDate = new Date(prefDate);
        prefDateStr = $dateworks.dateToWeekDayName(prefDateDate) + ", " + $dateworks.dateToLocalDateStr(prefDate) + " " + (prefDateDate.getHours() < 12 ? "AM" : "PM");
        request = "Vehicle: " + getVehiclePar("regno") + "\r\n" + "Preferable date: " + prefDateStr;

        //vehicle

        addInfo += addLine;
        addInfo += "Vehicle:\r\n";
        addInfo += addLine;

        partVehicle.find("input").each(function () {
            var input = $(this),
                name = input.siblings("label").text();

            addInfo += name + ": " + input.val() + "\r\n";
        });

        //Booking Request Summary

        addInfo += addLine;
        addInfo += "Booking Request Summary:\r\n";
        addInfo += addLine;

        $(".table-summary-items").find("tr").each(function () {
            var tr = $(this),
                tds = tr.children();

            addInfo += $(tds[0]).text() + ": £" + $(tds[1]).find("input").val() + "\r\n";
        });

        addInfo += addLineSmall;
        addInfo += "TOTAL: " + $(".data-summary-total").text() + "\r\n";

        //customer service

        addInfo += addLine;
        addInfo += "Customer Service: " + $(".part-customer-service input:checked").val() + "\r\n";

        //collection & delivery

        if (partColDel.is(":visible")) {
            addInfo += addLine;
            addInfo += "Collection & Delivery:\r\n";
            addInfo += addLine;

            partColDel.find("input").each(function () {
                var input = $(this),
                    name = input.siblings("label").text();

                addInfo += name + ": " + input.val() + "\r\n";
            });
        }

        //anything else

        if (anyElse !== undefined && anyElse !== "") {
            addInfo += addLine;
            addInfo += "Anything else we need to check: " + anyElse + "\r\n";
        }

        //query

        $.ajax({
            url: $page.urlAjax.replace("_tpl_", "_B62B4767_BookService"),
            data: {
                title: "",
                fullName,
                email,
                phone,
                branch,
                request,
                addInfo
            },
            type: "POST",
            async: true,
            beforeSend: function () { $page.beginWait(); },
            success: function (result) {
                if (result.error !== undefined && result.error !== "") {
                    onError(result.error);
                } else {
                    window.open($page.urlBookSuccess + "?" + encodeURI("location=" + branchDesc) + "&" + encodeURI("leadId=" + result.leadId) + "&" + encodeURI("bookDate=" + prefDateStr), "_self");
                }
            },
            error: function (xhr) {
                onError(xhr.statusText);
            },
            timeout: 0
        });
    }
};
