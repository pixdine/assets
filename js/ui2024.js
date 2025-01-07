function accordionInit() {
    var $target = $('.contents-list-wrap .item-group-list'),
        $btn = $target.find('button'),
        $panel = $target.find('ul');

    if (!$target.length) {
        return false;
    }

    $btn.off().on('click', function () {
        if ($(this).hasClass('active')) {
            $(this).removeClass('active');
            $(this).next('ul').slideUp(300);
        } else {
            $btn.removeClass('active')
            $(this).addClass('active');
            $panel.slideUp(300);
            $(this).next('ul').slideDown(300);
        }
    })
}

function txtLineBr() {
    $('.badge-lesson').each(function () {
        var $this = $(this);
        var len = $this.text().length;

        if(len == 3){
            $this.addClass('txt-3'); // 3글자, 1줄
        } else if (len > 2 && len <= 5) {
            $this.addClass('line-br'); // 2글자, 2줄
        } else if (len > 5 && len <= 6) {
            $this.removeClass('line-br').addClass('line-br-3txt'); // 3글자 2줄
        } else if (len > 6 && len <= 15) {
            $this.removeClass('line-br').addClass('line-br2-3txt'); // 3글자 3줄
        }

        if ($this.parent().hasClass('item-style1') && len > 2) {
            $this.addClass('txt-br').removeClass('line-br'); // 이전주제, 다음주제 2글자, 2줄
        }
    });
}

function dataGroupSlide(){
    var $obj = $('.data.group-content'),
        $btn = $obj.find('.group-content-slide-btn'),
        $panel = $obj.find('.data-group-child-area')

    if (!$obj.length) {
        return false;
    }

    $obj.each(function(){
        if($(this).hasClass('active')){
            $(this).find('.data-group-child-area').slideDown(300);
        }
    });

    $btn.off().on('click' , function(e){
        e.preventDefault();

        $(this).parents($obj).toggleClass('active');
        $(this).parents('.data.group-content').find('.data-group-child-area').slideToggle(300);
    });
}

function txtEllipsis(){
    var $obj = $('body.lesson-2024 .period-contents .lesson-items .item .data');

    if (!$obj.length) {
        return false;
    }

    $obj.each(function(){
        if($(this).find('.number-pages .badge').length === 0){
            $(this).find('strong').addClass('ellipsis-multi')
        }
    })
}

function popOverInit(){
    $('.tooltip-trigger').each(function(){
        $(this).webuiPopover();
    });
}

function radioTabInit(){
    var $radio = $('.data-upload-category input[type="radio"]'),
        $panel = $('.data-upload-category-parent').children()

    if(!$('.data-upload-category').length){
        return false;
    }

    $radio.each(function(){
        var $idx = $('.data-upload-category input[type="radio"]:checked').parent().index();
        $panel.removeClass('active');
        $panel.eq($idx).addClass('active');
    })

    $radio.on('click' , function(){
        var $idx = $(this).parent().index();
        $panel.removeClass('active');
        $panel.eq($idx).addClass('active');
    });
}
/*
function getWindowHeight(){
    var wIh = $(window).innerHeight();
    var wOh = $(window).outerHeight();
    var target = $('body.lesson-2024 .wrapper-lesson');

    function setScrH(){
        var wWidth = $(window).width();
        var wIh = $(window).innerHeight();
        var wOh = $(window).outerHeight();
        var scrH = wOh - wIh;
        var vh = window.innerHeight * 0.01;

        if(wWidth > 1320){
            target.css('--vh',`${vh}px`)
        }

        target.css('--scroll-height',`${scrH}px`)
    }

    setScrH();

    $(window).on('resize' , function(){
        setScrH();
    })
}
*/
function getWindowHeight(){
    var target = $('body');
    var wIh = $(window).innerHeight();
    var wOh = $(window).outerHeight();
    var scrH = wOh - wIh;

    function setScrH(){
        var vh = window.innerHeight * 0.01;
        target.css({
            '--vh' : `${vh}px`,
            '--scroll-height':`${scrH}px`
        })
    }
    setScrH();
    $(window).on('resize' , function(){
        setScrH();
    })
}

function myUploadBtnSlide(){
    var $obj = $('.float-bottom-buttons'),
        $btn = $obj.find('.float-button');
    $btn.on('click' , function(){
        $obj.toggleClass('active');
    })
}

function pdfLenChk(){
    var $obj = $('.contents-list ul li'),
        $btnsLen = $obj.find('button');

    if(!$btnsLen.length){
        return false;
    }

    $obj.each(function(){
        var $len = $(this).find('button').length;
        if(!$len == 0){
            $(this).addClass('item-len-' + $len);
        };
    });
}

function menuDimHide(){
    $(document).on('click', '#other-items .dimd' , function(e){
        closePopup({id: "other-items"});
    });
}

$(function () {
    accordionInit();
    $('.swiper-button-prev,.swiper-button-next').show();
    popOverInit();
    txtLineBr();
    // dataGroupSlide();
    txtEllipsis();
    radioTabInit();
    getWindowHeight();
    myUploadBtnSlide();
    pdfLenChk();
    menuDimHide();
});