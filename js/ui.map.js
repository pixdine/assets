$(document).ready(function () {
	mapCommonUI();
	mapPlugin();
	bestTheme(".btn-best-theme", "show", 15000);

	/* tab 클릭 시 result-cont영역에 top 버튼 노출 */
	$(".tab a").click(function(){ //퍼블 확인 용. 항상 개발에서 목록 호출 완료 후 topBtnShow(".result-cont") 기능을 호출해야 함.
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
	mapMainVisual();
	mapZoomRange();
	searchAaccordion();
	leftMenu();
	clearInput("body");
	checkboxDropdown(".filter-box");

	topBtnShow(".result-cont");
	//mapCont(".map-control");
}

/* 지도 Plugin */
const mapPlugin = function () {
	mapSwiper();
	mapTooltip(".layer-wrap", false);
}

/* plugin : Swiper */
const mapSwiper = function (){
	//디지털 지도 메인 : 자료실
	sliderLibrary(".library-slider .slider", 3, 3, 24);

	//디지털 지도 메인 : 선생님 테마관
	sliderTheme(".theme-slider .slider");
}

const sliderLibrary = function(item, viewNo, groupNo, gap) {
	const swiper = new Swiper(item, {
		slidesPerView: viewNo,
		slidesPerGroup: groupNo,
		spaceBetween: gap,
		navigation: {
			nextEl: ".swiper-button-next",
			prevEl: ".swiper-button-prev",
		},
		pagination: {
			el: ".swiper-pagination",
			clickable: true,
		}
	});
}

const sliderTheme = function (item) {
	const slideCount = $(item).find(".swiper-slide").length;

	const swiper = new Swiper(item, {
		speed: 400,
		autoplay: {
			disableOnInteraction: false,
		},
		loop: slideCount > 1, // 슬라이드가 2개 이상일 때만 loop 활성화
		navigation: slideCount > 1
			? {
				nextEl: ".swiper-button-next",
				prevEl: ".swiper-button-prev",
			}
		: false,
		pagination: slideCount > 1
			? {
				el: ".swiper-pagination",
				clickable: true,
			}
		: false,
	});


	// 슬라이드가 2개 이상일 때만 navigation 버튼을 표시
	if (slideCount <= 1) {
		$(item).find(".swiper-button-next, .swiper-button-prev").hide();
	}

	// 슬라이드 hover 시 autoplay 제어
	$(item).find(".swiper-slide").on("mouseover", function () {
		swiper.autoplay.stop();
	});
	$(item).find(".swiper-slide").on("mouseleave", function () {
		swiper.autoplay.start();
	});
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

/* 지도 메인 : 비주얼 */
const mapMainVisual = function(){
	$(".main-visual .item-domestic").hover(
		function () {
			$(".item-world").append("<div class='dimed'></div>");
			$(".dimed").fadeIn(200);
		},
		function () {
			$(".dimed").fadeOut(200, function () {
				$(this).remove();
			});
		}
	);

	$(".main-visual .item-world").hover(
		function () {
			// 오른쪽 박스가 커지고, 왼쪽 박스는 작아짐
			$(".item-domestic").css("flex-grow", 0.968);
			$(".item-world").css("flex-grow", 2);

			$(".item-domestic").append("<div class='dimed'></div>");
			$(".dimed").fadeIn(200);

		},
		function () {
			// 초기 상태로 복원
			$(".item-domestic").css("flex-grow", 2);
			$(".item-world").css("flex-grow", 0.968);

			$(".dimed").fadeOut(200, function () {
				$(this).remove();
			});
		}
	);
}

/* 지도 페이지 : 지도 우측 컨트롤러 레이어 모두 닫기 */
const closeAllPopups = function() {
	for (let i = popupArr.length - 1; i >= 0; i--) {
		if (popupArr[i].popup.closest('.map-toolbox').length > 0) {
			closePopup(popupArr[i]);
		}
	}
}

/* 지도 페이지 : 좌측 메뉴 top 버튼 노출 여부 */
const topBtnShow = function(_target){
	_target = $(_target);

	_target.each(function(){
		if($(this).outerHeight() < $(this).children().outerHeight()){
			$(this).children().css("margin-bottom","40px");

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

/* 지도 페이지 : 좌측 메뉴 접기/펼치기 */
const leftMenu = function(){
	$(".btn-close-menu").on("click", function(e) {
		if (!$(this).hasClass("active")) {
			$(this).addClass("active");
			$(".menu-left").addClass("active");
			$(this).find("span.blind").text("메뉴 접기");
		} else {
			$(this).removeClass("active");
			$(".menu-left").removeClass("active");
			$(this).find("span.blind").text("메뉴 펼치기");
		}
	});
}

/* 지도 페이지 : 지도 Range */
const mapZoomRange = function(){
	$('.zoom-range input[type=range]').on('input', function(e) {
		var min = e.target.min,
		max = e.target.max,
		val = e.target.value;

		$(e.target).css({
			'backgroundSize': (val - min) * 100 / (max - min) + '% 100%'
		});
	}).trigger('input');
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

//레이어 닫기
const layerClose = function(_target, _type){
	_target = $(_target);
	if(_type == "remove"){
		_target.remove();
	} else {
		_target.hide();
	}
}

//map control 버튼 활성화 관련
const mapCont = function(_target){
	_target = $(_target);
	multi_active = ["btn-satellite","btn-panorama","btn-distance"]; //active 클래스가 유지되어야 하는 버튼 클래스 배열
	exc_active = ["btn-print"]; //active 적용안되어야 될 버튼 클래스 배열

	_target.find("> button").click(function(){

		// 버튼의 모든 클래스 가져오기
		const buttonClasses = $(this).attr("class").split(" ");

		// "active" 클래스를 제외한 클래스들만 필터링
		const filteredClasses = buttonClasses.filter(cls => cls !== "active");

		// 필터링된 클래스들이 multi_active 배열에 포함되는지 확인
		let isMatch = filteredClasses.every(cls => multi_active.includes(cls));
		let isExc = filteredClasses.every(cls => exc_active.includes(cls));

		// 결과 출력
		if (isMatch) {
			if($(this).hasClass("active")){
				$(this).removeClass("active");
			} else {
				$(this).addClass("active");
			}
		} else {
			if($(this).hasClass("active")){
				$(this).removeClass("active");
			} else {
				$(this).closest(_target).find("button").removeClass("active");
				$(this).addClass("active");
			}
		}

		if(isExc) {
			$(this).removeClass("active");
		}

	});
}

//active 활성화
const layerActive = function(_target){
	_target = $(_target);

	_target.show();
}
