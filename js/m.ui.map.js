$(document).ready(function () {
	mapCommonUI();
	mapPlugin();

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
	});

	//필터 버튼 클릭 시(우측 부가기능 메뉴 열고 닫기)
	$(".map-toolbox .btn-filter").on("click", function() {
		if (!$(this).hasClass("active")) {
			$(this).addClass("active");
			$(".map-control").not(".my-map").show();
		} else {
			$(this).removeClass("active");
			$(".map-control").not(".my-map").hide();
		}
	});

	//AI 클래스 공유 버튼 클릭 시
	$(".map-toolbox .btn-ai-class").on("click", function() {
		$(this).removeClass("active");
	});

	//학교 위치 버튼 클릭 시
	$(".map-toolbox .btn-location").on("click", function() {
		$(this).removeClass("active");
	});
});

/* 지도 UI */
const mapCommonUI = function(){
	setCSS();
	mapZoomRange.init();
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
	sliderMultiView(".library-slider .slider", 2);

	//디지털 지도 : 베스트 테마
	sliderMultiView(".best-theme-slider .slider", 3);

	//VR 메인 : 지역 탭, 지역 리스트 슬라이드
	sliderRegionTab();
	sliderRegionList(".region-slider .slider", 2);

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

const sliderMultiView = function (item, num) {
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

const sliderRegionList = function (item, num) {
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
			speed: 400,
			pagination: {
				el: ".swiper-pagination",
				clickable: true,
			},
			observer: true,
			observeParents: true,
		});
	} else {
		$(item).find(".swiper-pagination").hide();
	}
}

const sliderRegionTab = function () {
	sliderRegionTab();

	function sliderRegionTab() {
		const swiper = new Swiper(".vr-slider .slider", {
			slidesPerView: 3,
			navigation: {
				nextEl: ".swiper-button-next",
				prevEl: ".swiper-button-prev",
			},
			loop: true,
			centeredSlides: true,
			on: {
				slideChangeTransitionEnd: function () {
					updateRegionTabCont();
				}
			},
			observer: true,
			observeParents: true,
		});

		// 지역 선택 팝업에서 적용하기 버튼 클릭 시 해당 슬라이드로 이동
		$("#regionApply").on("click", function () {
			var selectedId = $(".ox-tab input[name='regionSelect']:checked").attr("id");
			if (!selectedId) return;

			var targetTab = selectedId.replace("region-", "tab-");

			// 슬라이드의 realIndex 찾기
			let targetIndex = -1;
			$(".vr-slider .swiper-slide").each(function (index) {
				var slideLink = $(this).find("a").attr("href");
				if (slideLink === "#" + targetTab) {
					targetIndex = $(this).data("swiper-slide-index");
					return false;
				}
			});

			// 해당 슬라이드로 이동
			if (targetIndex !== -1) {
				swiper.slideToLoop(targetIndex, 500);
			}
		});

		// 지역 선택 팝업에서 닫기 버튼 클릭 시 현재 활성화된 슬라이드 기준으로 라디오 버튼 초기화
		$("#popup-region-select .close-button").on("click", function () {
			var $activeSlide = $(".vr-slider .swiper-slide-active a");
			if ($activeSlide.length) {
				var targetId = $activeSlide.attr("href");
				var radioId = targetId.replace("#tab-", "region-");

				$(".ox-tab input[name='regionSelect']").prop("checked", false);
				$("#" + radioId).prop("checked", true);
			}
		});

		// 슬라이드 클릭 시 이동 처리
		$(".vr-slider .swiper-slide").on("click", function (e) {
			e.preventDefault();
			if ($(this).hasClass("swiper-slide-next")) {
				swiper.slideNext();
			} else if ($(this).hasClass("swiper-slide-prev")) {
				swiper.slidePrev();
			}
		});
	}

	// 슬라이드 변경 시 탭 콘텐츠 및 라디오 버튼 체크
	function updateRegionTabCont() {
		$(".vr-tabcont-wrap .tabcont").removeClass("active");

		var $activeSlide = $(".vr-slider .swiper-slide-active a");
		if ($activeSlide.length) {
			var targetId = $activeSlide.attr("href");
			$(targetId).addClass("active");

			// 라디오 버튼 체크
			var radioId = targetId.replace("#tab-", "region-");
			$(".ox-tab input[name='regionSelect']").prop("checked", false);
			$("#" + radioId).prop("checked", true);
		}
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

/* 지도 페이지 : 토스트 메시지 팝업 */
const setToast = function(msg, timer) {
	if (!timer) { timer = 2000; } // 기본값 2초

	if (msg) {
		msg = msg.replace(/[\r\n]+|\\n/g, "<br/>");
	}

	const toastCont = $("<div class='toast-msg'><span class='msg-box'>" + msg + "</span></div>");

	if ($("body").find(".toast-msg").length < 1) {
		$("body").append(toastCont);

		setTimeout(() => {
			toastCont.addClass("active");
		}, 10);
	}

	if (!isNaN(timer)) {
		setTimeout(function() {
			setTimeout(() => {
				toastCont.fadeOut(1000, function() {
					$(this).remove();
				});
			}, 500);
		}, timer);
	}
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