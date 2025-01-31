$(document).ready(function () {
	mapCommonUI();
	mapPlugin();
	bestTheme(".btn-best-theme", "show", 10000);

	/* 팝업 오픈 시 result-cont영역에 top 버튼 노출 */
	$("[target-obj='popup-result-list-01'], [target-obj='popup-result-list-02']").on("click", function(){ //퍼블 확인 용. 개발에서 팝업 호출 완료 후 topBtnShow(".result-cont") 기능을 호출해야 함.
		/* 지도 이동 시 개발에서 목록 호출 완료 후 setTime과 함께 실행(목록 전체 로드 하는 시간이 지난 후 높이값을 계산해야 해서 텀이 필요) */
		setTimeout(function(){
			topBtnShow(".result-cont");
		});
		/* //지도 이동 시 개발에서 목록 호출 완료 후 setTime과 함께 실행 */
	});
});

$(window).on("load", function(){
	/* 지도 페이지 : 지도 우측 컨트롤러 */
	var excBtn = $(".map-toolbox .btn-my-map, .btn-sns-share"); //레이어가 나타나는 예외 버튼

	$(".map-control li > button").not(excBtn).on("click", function() {
		if ($(this).hasClass("active")) {
			$(this).removeClass("active");
		} else {
			$(".map-control li > button").removeClass("active");
			$(this).addClass("active");
		}
		closeAllPopups();
		$('.info-layer').removeClass('active');
	});

	//MY 지도 버튼 클릭 시
	$(".map-toolbox .btn-my-map").on("click", function() {
		closePopup({id: 'layer-sns-share'});
		$(".map-control li > button").not(excBtn).removeClass("active");
	});

	//AI 클래스 공유 버튼 클릭 시
	$(".map-toolbox .btn-ai-class").on("click", function() {
		$(this).removeClass("active");
	});

	//SNS 공유 버튼 클릭 시
	$(".map-toolbox .btn-sns-share").on("click", function() {
		closePopup({id: 'layer-my-map'});
		$(".map-control li > button").not(excBtn).removeClass("active");
	});

	//학교 위치 버튼 클릭 시
	$(".map-toolbox .btn-location").on("click", function() {
		$(this).removeClass("active");
	});

	//인쇄 상태로 전환될 때 지도 요소의 크기와 배율을 조정하는 기능
	window.matchMedia("print").addEventListener("change",(e)=>{
		var a4Ratio = 297 / 210;
		var bodyRatio = currentMapWidth / currentMapHeight;
		var bodyHeight = $("body").outerHeight();
		var bodyWidth = $("body").outerWidth();
		var zoom = bodyWidth / currentMapWidth;

		if( bodyRatio>= a4Ratio) { //지도의 비율이 A4 비율보다 크거나 같으면 너비 기준으로 배율을 설정
			zoom = bodyWidth / currentMapWidth
		} else { //높이 기준으로 배율을 설정
			zoom = bodyHeight / currentMapHeight
		}		
		console.log(zoom);

		var $map = $("#map");
		if(e.matches) { //인쇄 모드 진입 시
			$map.css({
				width: currentMapWidth + "px",
                height: currentMapHeight + "px",
                zoom: zoom
			});
		} else { //인쇄 모드 종료
            $map.css({
                width: "",
                height: "",
                zoom: ""
            });
			$(".map-toolbox .btn-print").removeClass("active");
		}
	});

	//인쇄 버튼 클릭 시
	currentMapWidth = 1
	currentMapHeight = 1
	$(".map-toolbox .btn-print").on("click", function() {
		var $map = $('#map');
		currentMapWidth = $map.outerWidth();
		currentMapHeight = $map.outerHeight();

		window.print();
	});
});

/* 지도 UI */
const mapCommonUI = function(){
	setCSS();
	mapZoomRange.init();
	searchAaccordion();
	clearInput(".search-item");
	checkboxDropdown(".filter-box");

	topBtnShow(".result-cont");
	tabs(".step-select");
	targetNextStep(".step-wrap");
	selectDropdown.init();
}

/* 지도 Plugin */
const mapPlugin = function () {
	mapSwiper();
	mapTooltip(".layer-wrap", false);
}

/* plugin : Swiper */
const mapSwiper = function (){
	//디지털 지도 메인 : 비주얼
	sliderMapVisual(".main-visual-slider .slider");

	//디지털 지도 메인 : 자료실 & 선생님 테마관
	sliderLibrary(".library-slider .slider", 2);

	//디지털 지도 : 베스트 테마
	sliderLibrary(".best-theme-slider .slider", 3);

	//디지털 지도 : 사용 가이드
	sliderGuide(".guide-slider .slider");
}

const sliderMapVisual = function (item) {
	const slideCount = $(item).find(".swiper-slide").length;

	if(slideCount > 1){
		const swiper = new Swiper(item, {
			slidesPerView: "auto",
			spaceBetween: 12,
		});
	}
}

const sliderLibrary = function (item, num) {
	const slideCount = $(item).find(".swiper-slide").length;

	if(slideCount == 1){
		$(item).addClass("only");
	}

	if(slideCount > num){
		$(item).find(".controller").show();
		const swiper = new Swiper(item, {
			slidesPerView: 1,
			grid: {
			  rows: num,
			},
			navigation: {
				// 버튼
				nextEl: ".button-next",
				prevEl: ".button-prev",
			},
			pagination: {
				el: ".controller .swiper-pagination",
				type: "fraction",
				clickable: true,
			}
		});
	} else {
		$(item).find(".controller").hide();
	}
}

const sliderMultiView = function(item, viewNo, gap) {
	const slideCount = $(item).find(".swiper-slide").length;

	if(slideCount > 3){
		$(item).find(".controller").show();
		const swiper = new Swiper(item, {
			slidesPerView: viewNo,
			spaceBetween: gap,
			navigation: {
				// 버튼
				nextEl: ".controller .button-next",
				prevEl: ".controller .button-prev",
			},
			pagination: {
				el: ".controller .swiper-pagination",
				type: "fraction",
				clickable: true,
			}
		});
	} else {
		$(item).find(".controller").hide();
	}
}

const sliderGuide = function (item) {
	const slideCount = $(item).find(".swiper-slide").length;

	if(slideCount > 1){
		$(item).find(".controller").show();
		const swiper = new Swiper(item, {
			slidesPerView: 1,
			navigation: {
				// 버튼
				nextEl: ".swiper-button-next",
				prevEl: ".swiper-button-prev",
			},
			pagination: {
				el: ".swiper-pagination",
				clickable: true,
			}
		});
	} else {
		$(item).find(".controller").hide();
	}
}

/* plugin : Tooltip */
const mapTooltip = function (item, isMulti = true){
	$(`${item} .tooltip-trigger`).each(function(idx, el){
		$(el).webuiPopover({
			multi: isMulti,
			backdrop: $(el).is("[data-backdrop]"),
			closeable: $(el).is("[data-closeable]"),
			style: $(el).is("[data-style]") ? `${$(el).attr("data-style")}` : false,
			container: $(el).is("[data-container]") ? $(`${$(el).attr("data-container")}`) : false,
			onShow: function(){
				if($(el).is("[data-focus]")){
					$(el).addClass('focus');
				}
			},
			onHide: function(){
				if($(el).is("[data-focus]")){
					$(el).removeClass('focus');
				}
			}
		})
	})
}

/* iOS vh 대응 */
const setCSS = function(){
	var setVh = () => {
		document.documentElement.style.setProperty("--vh", `${window.innerHeight}px`);
	};
	window.addEventListener("resize", setVh);
	setVh();
}

/* 지도 페이지 : 지도 우측 컨트롤러 레이어 모두 닫기 */
const closeAllPopups = function() {
	for (let i = popupArr.length - 1; i >= 0; i--) {
		if (popupArr[i].popup.closest('.map-toolbox').length > 0) {
			closePopup(popupArr[i]);
		}
	}
}

/* 지도 페이지 : 자료 리스트 팝업 내 top 버튼 노출 여부 */
const topBtnShow = function(_target){
	_target = $(_target);

	_target.each(function(){
		const bottomFixed = $(this).siblings(".bottom-fixed");
		const isBottomFixed = bottomFixed.length > 0 && bottomFixed.css("display") !== "none";

		if($(this).outerHeight() < $(this).children().outerHeight()){
			if (isBottomFixed) {
				$(this).children().css("margin-bottom", "0");
			} else {
				$(this).children().css("margin-bottom", "40px");
			}

			$(this).scroll(function(){
				if($(this).scrollTop() > 0){
					$(this).siblings(".btn-top").addClass("active");
				} else {
					$(this).siblings(".btn-top").removeClass("active");
				}
			});

			$(this).siblings(".btn-top").click(function(){
				$(this).siblings(".result-cont").animate({
					scrollTop:0
				}, 500);
			});
		}
	});
}

/* 지도 페이지 : 지도 Range */
const mapZoomRange = {
	// Input range 변경 시 배경 크기 업데이트
	updateRangeBg: function($rangeInput) {
		const min = $rangeInput.attr("min");
		const max = $rangeInput.attr("max");
		const val = $rangeInput.val();

		$rangeInput.css("backgroundSize", ((val - min) * 100 / (max - min)) + "% 100%");
	},

	// btn-zoom-in 클릭 시 동작
	rangeZoomIn: function($rangeInput) {
		const currentValue = parseFloat($rangeInput.val());
		const max = parseFloat($rangeInput.attr("max"));
		const step = parseFloat($rangeInput.attr("step")) || 1;

		if (currentValue < max) {
			$rangeInput.val(Math.min(currentValue + step, max)).trigger("input");
		}
	},

	// btn-zoom-out 클릭 시 동작
	rangeZoomOut: function($rangeInput) {
		const currentValue = parseFloat($rangeInput.val());
		const min = parseFloat($rangeInput.attr("min"));
		const step = parseFloat($rangeInput.attr("step")) || 1;

		if (currentValue > min) {
			$rangeInput.val(Math.max(currentValue - step, min)).trigger("input");
		}
	},

	// 초기화 및 이벤트 바인딩
	init: function() {
		const $rangeInput = $(".map-zoom .zoom-range input[type=range]");

		// Input range 변경 시 배경 크기 업데이트
		$rangeInput.on("input", () => {
			this.updateRangeBg($rangeInput);
		}).trigger("input");

		// btn-zoom-in 버튼 클릭
		$(".map-zoom .btn-zoom-in").on("click", () => {
			this.rangeZoomIn($rangeInput);
		});

		// btn-zoom-out 버튼 클릭
		$(".map-zoom .btn-zoom-out").on("click", () => {
			this.rangeZoomOut($rangeInput);
		});
	}
}

/* 지도 페이지 : 검색 영역 열기/닫기 */
const searchAaccordion = function(){
	$(".pane-wrap .pane .btn-action").on("click", function (e) {
		const $pane = $(this).closest(".pane");

		if (!$(this).hasClass("active")) {
			$(this).addClass("active");
			$(".tab").hide();
			$(".search-item-box").hide();
			$(".result-box").show();
			$(this).find("span").text("검색 영역 열기");
		} else {
			$(this).removeClass("active");
			$(".tab").show();
			$(".search-item-box").show();
			$(".result-box").hide();
			$(this).find("span").text("검색 영역 닫기");
		}
	});
}

/* 지도 페이지 : 검색 영역 열기/닫기(모션) */
/*
const searchAaccordion = function(){
	$(".pane-wrap .pane .btn-action").on("click", function (e) {
		e.preventDefault();
		const $pane = $(this).closest(".pane");
		var $targetHeight = $(".tab").outerHeight() + $pane.find(".search-area").outerHeight();
		var $resultBoxHeight = $pane.find(".result-box .inner").outerHeight();

		if (!$(this).hasClass("active")) {
			$(this).addClass("active");
			$(".search-tabs").animate({ marginTop :-$targetHeight });
			$(".result-box").animate({ height : $resultBoxHeight });
		} else {
			$pane.find(".btn-action").removeClass("active");
			$(".search-tabs").animate({ marginTop : 0 });
			$(this).removeClass("active");
			$(".result-box").animate({ height : 0 });
		}
	});
}
*/

/* 지도 페이지 : 체크박스 드롭다운 */
const checkboxDropdown = function(el){
	var $el = $(el);

	$el.each(function(i, element) {
		var $label = $(this).find(".filter-label");;
		
		//라벨 클릭 시 열고 닫기
		$label.on("click", ()=> {
			$(this).toggleClass("open");
		});

		//외부 클릭 시 닫기	
		$(document).on("click touchstart", e => {
			if(!$(e.target).closest($(this)).length) {
				$(this).removeClass("open");
			}
		});
	});
}

/* 지도 페이지 : 베스트테마 열고 닫기 */
const bestTheme = function(_target, _type, _time){ // _target : 클릭할 버튼명, _type : 처음 열어둘것인지 여부, _time : 자동으로 닫을 시간
	_target = $(_target);

	if(_type == "show"){ //처음 열어둠
		_target.parent().addClass('active');
	}

	if(_type == "hide"){ //display:none처리
		_target.parent().hide();
	}

	setTimeout(function(){ //처음 열린 상태로 설정시간 후 자동 닫힘
		_target.parent().removeClass("active");
	}, _time);

	_target.click(function(){ //버튼 클릭 시 열고 닫기
		if(_target.parent().hasClass("active")){
			_target.parent().removeClass("active");
		} else {
			_target.parent().addClass("active");
		}
	});
}

/* 지도 페이지 : 상단필터 레이어(토글 클릭 이벤트) */
$(document).on("click", "[target-obj][method-type='toggle-only']", function(){
	if($(this).hasClass("active")){
		$(this).removeClass("active");
		closePopup({id: $(this).attr("target-obj")});
	} else {
		// 다른 활성화된 팝업 닫기
		$("[target-obj][method-type='toggle-only']").each(function() {
			if ($(this).hasClass("active")) {
				$(this).removeClass("active");
				closePopup({id: $(this).attr("target-obj")});
			}
		});
  
		// 현재 클릭한 요소 활성화 및 팝업 열기
		$(this).addClass("active");
		openPopup({id: $(this).attr("target-obj"), target: $(this)});
	}
});

// close-obj 클릭 시 팝업 닫기 및 toggle-only의 active 클래스 제거
$(document).on("click", "[close-obj]", function(){
	const targetId = $(this).attr("close-obj");
	closePopup({id: $(this).attr("target-obj")});
  
	// toggle-only에서 active 클래스 제거
	$("[target-obj][method-type='toggle-only']").each(function() {
		if ($(this).attr("target-obj") === targetId) {
			$(this).removeClass("active");
		}
	});
});


/* 지도 페이지 : 상단필터 레이어 - 적용하기 클릭 시 다음 스텝으로 이동 */
const targetNextStep = function (item) {
	$(item).find("[target-next-step]").on("click", function () {
		const currentPane = $(this).closest(".pane");
		const nextPane = currentPane.next(".pane");
		const currentTab = $(this).closest(item).find("li.active");
		const nextTab = currentTab.next("li");

		if (nextPane.length && nextTab.length) {
			currentPane.removeClass("display-show");
			nextPane.addClass("display-show");

			currentTab.removeClass("active");
			nextTab.addClass("active");
		}
	});
}

/* 지도 페이지 : 연계 교과 셀렉트박스 */
const selectDropdown = {
	init: function() {
		const $selectbox = $("[data-selectbox]");

		if ($selectbox.length < 1) return;

		$selectbox.each((index, el) => {
			const $el = $(el);
			const data = {
				wrap: $el,
				selected: $el.find("[data-selected]"),
				size: $el.data("set-size") || null,
				button: $el.find("[data-set-button]"),
				list: $el.find("[data-set-list]"),
				option: $el.find("[data-set-list] a")
			};

			this._set(data);
			this._selected(data);
			this._handlerButton(data);
			this._handlerOption(data);
		});
	},

	reset: function(target) {
		const $target = $(target);
		const $setButton = $target.find("[data-set-button]");
		const $selected = $target.find("[data-selected]");

		$selected.removeAttr("data-selected");

		$setButton.each((index, el) => {
			const $el = $(el);
			const text = $el.data("set-button");
			if (text) {
				$el.text(text);
			}
			$el.removeClass("active");
		});
	},

	_set: function(d) {
		if (d.size) {
			d.wrap.css("width", d.size);
		}
	},

	_selected: function(d) {
		if (d.selected.length) {
			const $a = d.selected.find("a");
			const $hasValue = $a.find(".value");
			const value = $hasValue.length ? $hasValue.text() : $a.text();

			d.selected.addClass("active");
			this._selectAction(d, value);
		}
	},

	_selectAction: function(d, value) {
		d.button.html(`<span>${value}</span>`).addClass("active");
		d.wrap.removeClass("active");
	},

	_handlerButton: function(d) {
		d.button.on("click", () => {
			if (d.wrap.hasClass("active")) return;
			d.wrap.addClass("active");

			setTimeout(() => {
				this._documentClose(d);
			});
		});
	},

	_handlerOption: function(d) {
		d.option.each((index, el) => {
			const $el = $(el);

			$el.on("click", (e) => {
				const $hasValue = $el.find(".value");
				const value = $hasValue.length ? $hasValue.text() : $el.text();

				this._selectAction(d, value);

				d.option.parent().removeAttr("data-selected");
				$el.parent().attr("data-selected", "");
			});
		});
	},

	_documentClose: function(d) {
		const action = (e) => {
			d.wrap.removeClass("active");
			$(document).off("click", action);
		};

		$(document).on("click", action);
	}
}