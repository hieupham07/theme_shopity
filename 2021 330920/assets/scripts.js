var timeOut_modalCart;
var viewout = true;
var check_show_modal = true;
var add_item_show_modalCart = function(id,quantity) {
	if( check_show_modal ) {
		check_show_modal = false;
		timeOut_modalCart = setTimeout(function(){ 
			check_show_modal = true;
		}, 1000);
		var params = {
			type: 'POST',
			url: '/cart/add.js',
			async: true,
			data: 'quantity=' + quantity + '&id=' + id,
			dataType: 'json',
			success: function(line_item) {
				getCartModal();					
			},
			error: function(XMLHttpRequest, textStatus) {
				alert('Sản phẩm bạn vừa mua đã vượt quá tồn kho');
			}
		};
		$.ajax(params);
	}
}
var plusQuantity = function() {
	if ( $('input[name="quantity"]').val() != undefined ) {
		var currentVal = parseInt($('input[name="quantity"]').val());
		if (!isNaN(currentVal)) {
			$('input[name="quantity"]').val(currentVal + 1);
		} else {
			$('input[name="quantity"]').val(1);
		}
	}
}
var minusQuantity = function() {
	if ( $('input[name="quantity"]').val() != undefined ) {
		var currentVal = parseInt($('input[name="quantity"]').val());
		if (!isNaN(currentVal) && currentVal > 1) {
			$('input[name="quantity"]').val(currentVal - 1);
		}
	}
}
function getCartModal(){
	var car = null;
	$.getJSON('/cart.js', function(cart, textStatus) {
		if(cart){
			jQuery('.count-holder .count').html(cart.item_count);
			if(cart.item_count == 0){				
				$('#cart-view').html('<div class="mini-cart_empty-state"><svg width="65" height="65" viewBox="0 0 81 70"><g transform="translate(0 2)" stroke-width="4" stroke="#333333" fill="none" fill-rule="evenodd"><circle stroke-linecap="square" cx="34" cy="60" r="6"></circle><circle stroke-linecap="square" cx="67" cy="60" r="6"></circle><path d="M22.9360352 15h54.8070373l-4.3391876 30H30.3387146L19.6676025 0H.99560547"></path></g></svg><p class="m-0">Hiện chưa có sản phẩm</p></div>');
			}
			else{			
				$('#cart-view').html('');
			}
			$.each(cart.items,function(i,item){
				clone_item(item,i);
			});
			$('#total-view-cart').html(Haravan.formatMoney(cart.total_price, formatMoney));
			$('.cart-subtotal').html(Haravan.formatMoney(cart.total_price, formatMoney));
		}
		else{
			$('#cart-view').html('<div class="mini-cart_empty-state"><svg width="65" height="65" viewBox="0 0 81 70"><g transform="translate(0 2)" stroke-width="4" stroke="#333333" fill="none" fill-rule="evenodd"><circle stroke-linecap="square" cx="34" cy="60" r="6"></circle><circle stroke-linecap="square" cx="67" cy="60" r="6"></circle><path d="M22.9360352 15h54.8070373l-4.3391876 30H30.3387146L19.6676025 0H.99560547"></path></g></svg><p class="m-0">Hiện chưa có sản phẩm</p></div>');
		}
	});
	if($('#site-header .navigation-header').hasClass('hSticky')){
		setTimeout(function(){
			$('.wrap-cart').addClass('show-action');
			$('body').addClass('locked-scroll');
			$('#site-header .navigation-header').addClass('hSticky').addClass('hSticky-down').addClass('hSticky-up');
		},300);
	}
	else{
		$('.wrap-cart').addClass('show-action');
		$('body').addClass('locked-scroll');
		jQuery('html, body').animate({
			scrollTop: 0			
		}, 600);
	}
}
function clone_item(product,i){
	var item_product = $('#clone-item-cart').find('.list-item');
	if ( product.image == null ) {
		item_product.find('img').attr('src','//theme.hstatic.net/1000406564/1000622245/14/no_image.jpg?v=1').attr('alt', product.title);
	} 
	else {
		item_product.find('img').attr('src',Haravan.resizeImage(product.image,'small')).attr('alt', product.title);
	}
	item_product.find('a:not(.remove-cart)').attr('href', product.url).attr('title', product.title);
	item_product.find('.pro-title-view').html(product.title);
	item_product.find('.pro-quantity-view').html(product.quantity);
	item_product.find('.pro-price-view').html(Haravan.formatMoney(product.price,formatMoney));
	item_product.find('.remove-cart').html("<a href='javascript:void(0);' onclick='deleteCart(" + (i+1) + ")' ><i class='fa fa-times'></i></a>");
	var title = '';
	if(product.variant_options.indexOf('Default Title') == -1){
		$.each(product.variant_options,function(i,v){
			title = title + v + ' / ';
		});
		title = title + '@@';
		title = title.replace(' / @@','')
		item_product.find('.variant').html(title);
	}
	else {
		item_product.find('.variant').html('');
	}
	item_product.clone().removeClass('d-none').prependTo('#cart-view');
}
function deleteCart(line){
	var params = {
		type: 'POST',
		url: '/cart/change.js',
		data: 'quantity=0&line=' + line,
		dataType: 'json',
		success: function(cart) {
			getCartModal();
		},
		error: function(XMLHttpRequest, textStatus) {
			Haravan.onError(XMLHttpRequest, textStatus);
		}
	};
	$.ajax(params);
}
function boxAccount(type){
	$('#account-popover .popover-panel').addClass('invisible');
	$('#account-popover .popover-panel').removeClass('is-selected');
	$('#account-popover .popover-panel#' + type ).removeClass('invisible');
	var newheight = $('#account-popover .popover-panel#' + type ).addClass('is-selected').height();
	if($('.popover-panel').hasClass('is-selected')){
		$('.popover-panel_list').css("height", newheight);
	}
};
function fixHeightProduct(data_parent, data_target, data_image) {
	var box_height = 0;
	var box_image = 0;
	var boxtarget = data_parent + ' ' + data_target;
	var boximg = data_parent + ' ' + data_target + ' ' + data_image;
	$(boximg).css('height', 'auto');
	$($(boxtarget)).css('height', 'auto');
	$($(boxtarget)).removeClass('fixheight');
	$($(boxtarget)).each(function() {
		if ($(this).find(data_image+' .lazyloaded').height() > box_image) {
			box_image = $(this).find($(data_image)).height();
		}
	});
	if (box_image > 0) {
		$(boximg).height(box_image);
	}
	$($(boxtarget)).each(function() {
		if ($(this).height() > box_height) {
			box_height = $(this).height();
		}
	});
	$($(boxtarget)).addClass('fixheight');
	if (box_height > 0) {
		$($(boxtarget)).height(box_height);
	}
	try {
		fixheightcallback();
	} catch (ex) {}
}
document.addEventListener('lazyloaded', function(e){
	fixHeightProduct('.wrapper-collection-1 .content-product-list', '.product-resize', '.image-resize');
	if(jQuery(window).width() > 991) {
		$(window).resize(function() {
			fixHeightProduct('.wrapper-collection-1 .content-product-list', '.product-resize', '.image-resize');
		});
	}
	fixHeightProduct('.wrapper-list-collection .product-list-filter', '.product-resize', '.image-resize');
	if(jQuery(window).width() > 991) {
		$(window).resize(function() {
			fixHeightProduct('.wrapper-list-collection .product-list-filter', '.product-resize', '.image-resize');
		});
	}
	fixHeightProduct('.wrapbox-content-page .search-list-results', '.product-resize', '.image-resize');
	if(jQuery(window).width() > 991) {
		$(window).resize(function() {
			fixHeightProduct('.wrapbox-content-page .search-list-results', '.product-resize', '.image-resize');
		});
	}
	fixHeightProduct('.productDetail-related .content-product-list', '.product-resize', '.image-resize');
	if(jQuery(window).width() > 991) {
		$(window).resize(function() {
			fixHeightProduct('.productDetail-related .content-product-list', '.product-resize', '.image-resize');
		});
	}
	fixHeightProduct('.productDetail-recently-viewed .content-product-list', '.product-resize', '.image-resize');
	if(jQuery(window).width() > 991) {
		$(window).resize(function() {
			fixHeightProduct('.productDetail-recently-viewed .content-product-list', '.product-resize', '.image-resize');
		});
	}
});
$(document).ready(function(){
	if(template.indexOf('index') > -1){
		var htmlprev = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"viewBox="0 0 407.436 407.436" style="enable-background:new 0 0 407.436 407.436;" xml:space="preserve"><polygon points="315.869,21.178 294.621,0 91.566,203.718 294.621,407.436 315.869,386.258 133.924,203.718 "/></svg>';
		var htmlnext = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 407.436 407.436" style="enable-background:new 0 0 407.436 407.436;" xml:space="preserve"><polygon points="112.814,0 91.566,21.178 273.512,203.718 91.566,386.258 112.814,407.436 315.869,203.718 " /></svg>';
		$('#home-slider').owlCarousel({
			items:1,
			nav: true,
			navText:[htmlprev,htmlnext],
			dots: true,
			lazyLoad:true,
			touchDrag: true,
			mouseDrag: true,
			animateOut: false,
			smartSpeed: 250,
			loop: $('#home-slider .wrapper-item').length > 1 ? true:false,
			responsive:{
				0:{
					items:1,
					nav: false,
					autoplay: false
				},
				768:{
					items:1,
					nav: false,
					autoplay: false
				},
				992:{
					items:1,
					nav: true,
					autoplay: true,
					autoplayTimeout: 5000,
					autoplaySpeed: 400,
					autoplayHoverPause: true
				}
			},
			onChanged: function (event) {
				setTimeout(function(){
					$('#home-slider').find('.owl-dot').each(function(index) {
						$(this).attr('aria-label', index + 1);
					});
				}, 400);
			}
		});
		if($("#collection-two-slide").length > 0) {
			$('#collection-two-slide').owlCarousel({
				nav: false,
				dots: false,		
				loop: false,	
				smartSpeed:1000,
				responsive: {
					0: {
						items: 1,
						nav: true
					},
					768: {
						items: 2,
						nav: true
					},
					992: {
						items: 4,
						nav: false
					},
					1200: {
						items: 4,
						nav: false
					}
				}
			});
		}
	}
	if($("#collection-three-slide").length > 0) {
		$('#collection-three-slide').owlCarousel({
			nav: false,
			dots: false,		
			loop: false,	
			smartSpeed:1000,
			responsive: {
				0: {
					items: 1,
					nav: true
				},
				768: {
					items: 2,
					nav: true
				},
				992: {
					items: 4,
					nav: false
				},
				1200: {
					items: 4,
					nav: false
				}
			}
		});
	}
	if($(".slider-banner-testimonials").length > 0) {
		$('.slider-banner-testimonials').owlCarousel({
			nav:true,
			navText:[htmlprev,htmlnext],
			dots:true,
			pagination: false,
			autoplayTimeout: 5000,
			autoplayHoverPause: true,
			slideSpeed : 1000,
			smartSpeed: 1000,
			addClassActive: true,
			scrollPerPage: false,
			touchDrag: true,
			mouseDrag: true,
			autoplay: true,
			loop: $('.slider-banner-testimonials .banner-testimonials').length > 1 ? true:false,
			responsive:{
				0:{
					items:1,
					margin:15
				},
				768:{
					items:1,
					margin:15
				},
				992:{
					items:1,
					margin:15
				}
			},
			onChanged: function (event) {
				setTimeout(function(){
					$('.slider-banner-testimonials').find('.owl-dot').each(function(index) {
						$(this).attr('aria-label', index + 1);
					});
				}, 400);
			}
		});
	}
	if($(".home-blog").length > 0){
		if($(window).width() > 480){
			$('.home-blog .home-blog-wrap').slick({
				dots: true,
				arrows: false,
				infinite: false,
				speed: 300,
				slidesToShow: 3,
				slidesToScroll: 1,
				responsive: [
					{
						breakpoint: 768,
						settings: {
							slidesToShow: 2,
							slidesToScroll: 2
						}
					},
					{
						breakpoint: 480,
						settings: {
							slidesToShow: 1,
							slidesToScroll: 2
						}
					},
				]
			});
		}
	}
	/*if($(".instagram-list-img").length > 0){
		if($(window).width() > 480){
			$('.instagram-list-img').slick({
				dots: true,
				arrows: false,
				infinite: false,
				speed: 300,
				slidesToShow: 4,
				slidesToScroll: 1,
				responsive: [
					{
						breakpoint: 768,
						settings: {
							slidesToShow: 2,
							slidesToScroll: 2
						}
					},
				]
			});
		}
	}*/
	if ($(window).width() < 768) {
		$(document).on("click",'.main-footer .js-footer-block-title', function(){
			$(this).toggleClass('active').parent().find('.footer-block_content').stop().slideToggle('medium');
		});
	}
	if(template.indexOf('product') > -1){
		if($("#owlProductRelated").length > 0){
			$('#owlProductRelated').owlCarousel({
				items:5,
				nav: true,
				dots: false,
				pagination: false,
				slideSpeed : 1000,
				smartSpeed:1000,
				addClassActive: true,
				scrollPerPage: false,
				touchDrag: true,
				autoplay: false,
				loop: false,
				responsive:{
					0:{
						items:2,
						stagePadding: 15,
						margin:15
					},
					768:{
						items:4,
						margin:15,
					},
					992:{
						items:5,
						margin:15
					},
					1200:{
						items:5,
						margin:15
					}
				}
			});
		}
		$('.js-backto-page-history').click(function(){
			window.history.back();
		});
		if($('.product-tabs').length > 0){
			var $openPanel =  $(".tab-content-item.active .panel-toggle-wrap");
			var hContentTab = $openPanel.outerHeight();
			var maxHContentTab = 300;
			if (hContentTab > maxHContentTab) {
				$openPanel.addClass('applied-height');
				$openPanel.find(".content-outer").css({
					"max-height": "450px",
					"overflow": "hidden"
				});
				$openPanel.append("<div class=content-toolbar><div class=content-toggle><span>Xem thêm</span></div></div>");
			}
			$(".content-toggle").on("click", function () {
				$openPanel.toggleClass("content-outer-open");
				if ( $openPanel.hasClass("content-outer-open")) {
					$(this).find("span").text('Rút gọn');
				} else {
					$(this).find("span").text('Xem thêm');
				}
			});
			if ($(window).width() < 768) {
				$('.show-tab-dropdown_mobile').click(function(e){
					e.preventDefault();
					$(this).toggleClass('active');
				});
				let textTabTitle = $('.tab-title.active').text();
				$('.show-tab-dropdown_mobile').html(textTabTitle);
				$('.tab-title').click(function(e){
					e.preventDefault();
					$(this).parents('.product-description').find('.show-tab-dropdown_mobile').html($(this).text());
					$('.show-tab-dropdown_mobile').removeClass('active');
				});
			}
		}
	}
	if(template.indexOf('collection') > -1){
		if($(window).width() < 991){
			$('.filter-group-subtitle').on('click', function(){	
				$(this).toggleClass('group-layered');
				$(this).parent().find('.filter-group-content').slideToggle('medium');
				$(this).find('span.icon-control').toggleClass('activeFilter');
			});
		}
		/*$('body').on('mouseover', '.filter-group-subtitle', function(){
			$(this).addClass('group-layered');
			$(this).parent().find('.filter-group-content').slideDown('medium');
			//$(this).parent().find('.filter-group-subtitle').find('span.icon-control').toggleClass('activeFilter');
		})
		$('body').on('mouseout', '.filter-group-subtitle', function(){
			$(this).removeClass('group-layered');
			$(this).parent().find('.filter-group-content').slideUp('medium');
			//$(this).parent().find('.filter-group-subtitle').find('span.icon-control').toggleClass('activeFilter');
		})*/
		$('.js-collection-options-filter').click(function(e){
			if ($(window).width() < 992){
				$('body').addClass('open-filter');
			}
			else{
				$('.js-sortby-title').parent().removeClass('open-sort');
			}
			$('body').removeClass('open-sort');
		});
		$(document).on("click", "body.open-filter .site-overlay, .filter-close .back-icon", function(){
			$('body').removeClass("open-filter");
		});
		$(document).on("click", "body.open-sort .site-overlay, .collection-sortby-close_mb .back-icon_sortby", function(){
			$('body').removeClass("open-sort");
		});
		$(document).mouseup(function (e){
			var container = $('.js-sortby-title')
			container.click(function(){
				if ($(window).width() < 992){
					$('body').addClass('open-sort');
				}
				else{
					$(this).parent().toggleClass('open-sort');
				}
			})
			if (!container.is(e.target) && container.has(e.target).length === 0){
				$('body').removeClass('open-sort');
				$('.collection-sortby').removeClass('open-sort');
			}
		}); 
		/*jQuery('body').on('click', '.js-sortby-title', function(){
			if ($(window).width() < 992){
				$('body').addClass('open-sort');
			}
			else{
				$(this).parent().toggleClass('open-sort');
			}
		});*/
	}
	// MENU SIDEBAR
	$('.plus-nClick1').click(function(e){
		e.preventDefault();
		$(this).parents('.level0').toggleClass('opened');
		$(this).parents('.level0').children('ul').slideToggle(200);
	});
	$('.plus-nClick2').click(function(e){
		e.preventDefault();
		$(this).parents('.level1').toggleClass('opened');
		$(this).parents('.level1').children('ul').slideToggle(200);
	});
	$('.plus-nClick3').click(function(e){
		e.preventDefault();
		$(this).parents('.level2').toggleClass('opened');
		$(this).parents('.level2').children('ul').slideToggle(200);
	});
	$('.js-sidebox-title').click(function(){
		$(this).toggleClass('active').next().slideToggle('medium');
	});
	/* menu mobile*/
	$('.sub-child li a').click(function(e){
		if ($(this).find('i').length){
			e.preventDefault();
			var menu_child_id = $(this).parent().data('menu-root');
			$('.sub-child').addClass('mm-subopened');
			$('#' + menu_child_id).addClass('mm-opened');
		} 
	})
	$('.menuList-sub li:first-child a').click(function(){
		$(this).parents('.menuList-sub').removeClass('mm-opened');
		$('.menuList-sub').removeClass('mm-subopened');
	})
	$('.menuList-sub li.level-2 a').click(function(e){
		if ($(this).find('i').length){
			e.preventDefault();
			var menu_sub_id = $(this).parent().data('menu-root');
			$('li.level-2').addClass('mm-subopened');
			$('#' + menu_sub_id).addClass('mm-sub');
		} 
	});
	$('.menuList-sub li:first-child a').click(function(){
		$(this).parents('.menuList-sub').removeClass('mm-sub');
		$('.menuList-sub').removeClass('mm-subopened');
	});
	$(document).on("click",".menuList-sub li.level-3 a",function(e){
		if ($(this).find('i').length){
			e.preventDefault();
			var menu_subnav_id = $(this).parent().data('menu-root');
			$('li.level-3').addClass('mm-open-3');
			$('#' +  menu_subnav_id).addClass('mm-sub-3');
		} 
	});
	$(document).on("click",".menuList-sub li:first-child a",function(e){
		$(this).parents('.menuList-sub').removeClass('mm-sub-3');
		$('.menuList-sub').removeClass('mm-open-3');
	});
	/* scroll menu top*/
	var resizeTimer = false,
			resizeWindow = $(window).prop("innerWidth");
	var parentHeight = $('.main-header').outerHeight();
	var $header = $('.navigation-header');
	var offset_sticky_header = $header.outerHeight() + 100;
	var offset_sticky_down = 0;
	$('.main-header').css('min-height', parentHeight);
	$(window).on("resize", function() {
		if(resizeTimer){
			clearTimeout(resizeTimer)
		}
		resizeTimer = setTimeout(function() {
			var newWidth = $(window).prop("innerWidth");
			if (resizeWindow != newWidth) {
				$header.removeClass('hSticky-up').removeClass('hSticky-down').removeClass('hSticky');
				$('.main-header').css('min-height','');
				parentHeight = $('.main-header').outerHeight();
				$('.main-header').css('min-height', parentHeight);
				resizeWindow = newWidth 
			}
		},200);
	});
	setTimeout(function() {
		$header.removeClass('hSticky-up').removeClass('hSticky-down').removeClass('hSticky');
		$('.main-header').css('min-height','');
		parentHeight = $('.main-header').outerHeight();
		$('.main-header').css('min-height', parentHeight);
		jQuery(window).scroll(function() {	
			/* scroll header */
			if(jQuery(window).scrollTop() > offset_sticky_header && jQuery(window).scrollTop() > offset_sticky_down) {	
				if(jQuery(window).width() > 991){		
					$('body').removeClass('locked-scroll');
					$('.header-action').removeClass('show-action');
				}
				$header.addClass('hSticky');	
				if(jQuery(window).scrollTop() > offset_sticky_header + 150){
					$header.removeClass('hSticky-up').addClass('hSticky-down');	
					$('body').removeClass('scroll-body-up');
					$('.f-nav .f-nav-one > li.onMega .f-nav-two').addClass('hide');
				}
			} 
			else {
				if(jQuery(window).scrollTop() > offset_sticky_header + 150 && (jQuery(window).scrollTop() - 150) + jQuery(window).height()  < $(document).height()) {
					$header.addClass('hSticky-up');	
					$('body').addClass('scroll-body-up');
					$('.f-nav .f-nav-one > li.onMega .f-nav-two').removeClass('hide');
				}
			}
			if (jQuery(window).scrollTop() <= offset_sticky_down && jQuery(window).scrollTop() <= offset_sticky_header ) {
				$header.removeClass('hSticky-up').removeClass('hSticky-down').removeClass('hSticky');
				$('body').removeClass('scroll-body-up');
				$('.f-nav .f-nav-one > li.onMega .f-nav-two').removeClass('hide');
			}
			offset_sticky_down = jQuery(window).scrollTop();
		});	
	}, 300);
	/* on click action icon header*/
	$('.header-action-toggle').click(function(e){
		e.preventDefault();		
		if($(this).parents('.header-action').hasClass('show-action')){
			$('body').removeClass('locked-scroll');
			$(this).parents('.header-action').removeClass('show-action');
		}
		else{
			$('.header-action').removeClass('show-action');
			$('body').addClass('locked-scroll');
			$(this).parents('.header-action').addClass('show-action');		
		}		
	});
	$('body').on('click', '#site-overlay', function(e){
		$('body').removeClass('locked-scroll');
		$('.header-action').removeClass('show-action');
	});
	/* click box account*/
	$('body').on('click', '.link-accented', function(e){
		e.preventDefault();
		boxAccount($(this).attr('aria-controls'));
	});
	$('#account-popover .form-group input').blur(function(){
		var valInput = $(this).val();
		if(valInput == '') {
			$(this).removeClass('is-filled');
		} else {
			$(this).addClass('is-filled');
		}
	});
	/* addthis-sharing */
	if ($('.addThis_listSharing').length > 0){
		$(window).scroll(function(){
			if($(window).scrollTop() > 100 ) {
				$('.addThis_listSharing').addClass('is-show');
			} else {
				$('.addThis_listSharing').removeClass('is-show');
			}
		});
		$('.body-popupform form.contact-form').submit(function(e){
			var self = $(this);
			if($(this)[0].checkValidity() == true){
				e.preventDefault();
				grecaptcha.ready(function() {
					grecaptcha.execute('6LdD18MUAAAAAHqKl3Avv8W-tREL6LangePxQLM-', {action: 'submit'}).then(function(token) {
						self.find('input[name="g-recaptcha-response"]').val(token);
						$.ajax({
							type: 'POST',
							url:'/contact',
							data: $('.body-popupform form.contact-form').serialize(),			 
							success:function(data){		
								$('.modal-contactform.fade.show').modal('hide');
								setTimeout(function(){ 				
									$('.modal-succesform').modal('show');					
									setTimeout(function(){	
										$('.modal-succesform.fade.show').modal('hide');							
									}, 5000);
								},300);
							},				
						})
					}); 
				});
			}
		});
		$(".modal-succesform").on('hidden.bs.modal', function(){
			location.reload();
		});
	}
	if ($(window).width() < 768 && $('.layoutProduct_scroll').length > 0 ) {
		var curScrollTop = 0;
		$(window).scroll(function(){	
			var scrollTop = $(window).scrollTop();
			if(scrollTop > curScrollTop  && scrollTop > 200 ) {
				$('.layoutProduct_scroll').removeClass('scroll-down').addClass('scroll-up');
			}
			else {
				if (scrollTop > 200 && scrollTop + $(window).height() + 150 < $(document).height()) {
					$('.layoutProduct_scroll').removeClass('scroll-up').addClass('scroll-down');	
				}
			}
			if(scrollTop < curScrollTop  && scrollTop < 200 ) {
				$('.layoutProduct_scroll').removeClass('scroll-up').removeClass('scroll-down');
			}
			curScrollTop = scrollTop;
		});
	}	
	/* submit form login*/
	$('#header-login-panel form#customer_login').submit(function(e) { 
		var self = $(this);
		if($(this)[0].checkValidity() == true){
			e.preventDefault();
			grecaptcha.ready(function() {
				grecaptcha.execute('6LdD18MUAAAAAHqKl3Avv8W-tREL6LangePxQLM-', {action: 'submit'}).then(function(token) {
					self.find('input[name="g-recaptcha-response"]').val(token);
					self.unbind('submit').submit();
				}); 
			});
		}
	});
	$('#header-recover-panel form').submit(function(e) {
		var self = $(this);
		if($(this)[0].checkValidity() == true){
			e.preventDefault();
			grecaptcha.ready(function() {
				grecaptcha.execute('6LdD18MUAAAAAHqKl3Avv8W-tREL6LangePxQLM-', {action: 'submit'}).then(function(token) {
					self.find('input[name="g-recaptcha-response"]').val(token);
					self.unbind('submit').submit();
				}); 
			});
		}
	});
});
/* search header*/
$('.ultimate-search').submit(function(e) {
	e.preventDefault();
	var q = $(this).find('input[name=q]').val();
	if(q.indexOf('script') > -1 || q.indexOf('>') > -1){
		alert('Từ khóa của bạn có chứa mã độc hại ! Vui lòng nhập lại key word khác');
		$(this).find('input[name=q]').val('');
	}else{
		var q_follow = 'product';
		var query = encodeURIComponent(q);
		if( !q ) {
			window.location = '/search?type='+ q_follow +'&q=';
			return;
		}	
		else {
			window.location = '/search?type=' + q_follow +'&q=' + query;
			return;
		}
	}
});
var entity_code = [
	{ key: '(', val: '%26' },
	{ key: ')', val: '%27' },
	{ key: '|', val: '%28' },
	{ key: '-', val: '%29' },
	{ key: '&', val: '%30' }
];
function encode_haravan (val) {
	if((typeof val) !== 'string' || val == null || val == "")
		return val;

	val = val.replace('%', '%25');
	for (n = 0; n < entity_code.length ; n++) {
		var char = entity_code[n];
		val = val.replace(char.key, char.val);
	}

	return val;
}
var $input = $('.ultimate-search input[type="text"]');
$input.bind('keyup change paste propertychange', function() {
	var key = $(this).val(),
			$parent = $(this).parents('.wpo-wrapper-search'),
			$results = $(this).parents('.wpo-wrapper-search').find('.smart-search-wrapper');
	if(key.indexOf('script') > -1 || key.indexOf('>') > -1){
		alert('Từ khóa của bạn có chứa mã độc hại ! Vui lòng nhập lại key word khác');
		$('.ultimate-search input[type="text"]').val('');
	}
	else{
		if(key.length > 0 ){
			$('.ultimate-search input[type="text"]').val($(this).val());
			$(this).attr('data-history', key);
			var q_follow = 'product',
					str = '';
			str = '/search?type=product&q='+ encode_haravan(key) + '&view=ultimate-product';
			$.ajax({
				url: str,
				type: 'GET',
				async: true,
				success: function(data){
					$results.find('.resultsContent').html(data);
				}
			})
			$(".search-bar-mobile .ultimate-search").addClass("expanded");
			$results.fadeIn();	
		}
		else{
			$('.ultimate-search input[type="text"]').val($(this).val());
			$(".search-bar-mobile .ultimate-search").removeClass("expanded");
			$results.fadeOut();
		}
	}
});
$('body').click(function(evt) {
	var target = evt.target;
	if (target.id !== 'ajaxSearchResults' && target.id !== 'inputSearchAuto') {
		$("#ajaxSearchResults").hide();
	}
	if (target.id !== 'ajaxSearchResults-mb' && target.id !== 'inputSearchAuto-mb') {
		$("#ajaxSearchResults-mb").hide();
	}
	if (target.id !== 'ajaxSearchResults-dk' && target.id !== 'inputSearchAuto-dk') {
		$("#ajaxSearchResults-dk").hide();
	}
});
$('body').on('click', '.ultimate-search input[type="text"]', function() {
	if ($(this).is(":focus")) {
		if ($(this).val() != '') {
			$(".ajaxSearchResults").show();
		}
	} else {}
});
$('body').on('click', '.ultimate-search .search-close', function(e) {
	e.preventDefault();
	$(".ajaxSearchResults").hide();
	$(".ultimate-search").removeClass("expanded");
	$(".ultimate-search").find('input[name=q]').val('');
});
$('body').on('click', '.search-bar-mobile .ultimate-search input[type="text"]', function() {
	$('.header-action').removeClass('show-action');
	$('body').removeClass('locked-scroll');
});
$(document).ready(function () {

	$("#products-list-set").owlCarousel({
		nav: true,
		dots: false,
		loop: false,
		autoplay:true,
    autoplayTimeout:3000,
    autoplayHoverPause:true,
		smartSpeed: 1000,
		responsive: {
			0: {
				items: 2,
				nav: false
			},
			768: {
				items: 2,
				nav: false
			},
			992: {
				items: 3
			},
			1200: {
				items: 4
			}
		}
	});
	$("#content-product-list-1").owlCarousel({
		nav: true,
		dots: false,
		loop: true,
		smartSpeed: 1000,
		autoplay:true,
    autoplayTimeout:3000,
    autoplayHoverPause:true,
		responsive: {
			0: {
				items: 2,
				nav: false
			},
			768: {
				items: 2,
				nav: false
			},
			992: {
				items: 4
			},
			1200: {
				items: 5
			}
		}
	});
	$("#content-product-list-3").owlCarousel({
		nav: true,
		dots: false,
		loop: true,
		smartSpeed: 1000,
		autoplay:true,
    autoplayTimeout:3000,
    autoplayHoverPause:true,
		responsive: {
			0: {
				items: 2,
				nav: false
			},
			768: {
				items: 2,
				nav: false
			},
			992: {
				items: 4
			},
			1200: {
				items: 5
			}
		}
	});
	
	$("#list-product-sale-pages").owlCarousel({
		nav: true,
		dots: false,
		loop: true,
		smartSpeed: 1000,
		autoplay:true,
    autoplayTimeout:3000,
    autoplayHoverPause:true,
		responsive: {
			0: {
				items: 2,
				nav: false
			},
			768: {
				items: 2,
				nav: false
			},
			992: {
				items: 4
			},
			1200: {
				items: 5
			}
		}
	});
	$("#features-products-list").owlCarousel({
		nav: true,
		dots: false,
		loop: true,
		smartSpeed: 1000,
		autoplay:true,
    autoplayTimeout:3000,
    autoplayHoverPause:true,
		responsive: {
			0: {
				items: 2,
				nav: false
			},
			768: {
				items: 2,
				nav: false
			},
			992: {
				items: 3
			},
			1200: {
				items: 3
			}
		}
	});
	$("#features-products-more").owlCarousel({
		nav: false,
		dots: false,
		loop: true,
		smartSpeed: 1000,
		autoplay:true,
    autoplayTimeout:3000,
    autoplayHoverPause:true,
		responsive: {
			0: {
				items: 2,
				nav: false
			},
			768: {
				items: 2,
				nav: false
			},
			992: {
				items: 3,
				nav: true
			},
			1200: {
				items: 4,
				nav: true
			}
		}
	});
$(".modal-backdrop, #gioithieu .close").on("click", function() {
    $("#gioithieu iframe").attr("src", $("#gioithieu iframe").attr("src"));
});
	$(".modal-backdrop, #evening .close").on("click", function() {
    $("#evening iframe").attr("src", $("#evening iframe").attr("src"));
});
	$(".modal-backdrop, #yoshino .close").on("click", function() {
    $("#yoshino iframe").attr("src", $("#yoshino iframe").attr("src"));
});
	$(".modal-backdrop, #homage .close").on("click", function() {
    $("#homage iframe").attr("src", $("#homage iframe").attr("src"));
});
	$(".modal-backdrop, #enternal .close").on("click", function() {
    $("#enternal iframe").attr("src", $("#enternal iframe").attr("src"));
});
	$(".modal-backdrop, #trefolio .close").on("click", function() {
    $("#trefolio iframe").attr("src", $("#trefolio iframe").attr("src"));
});
});
