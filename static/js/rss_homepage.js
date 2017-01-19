$(function(){

//dynamic--------------
setSidebarHeight();
sidebarControl();
controlPull();
chooseCategory();
currentContents();

//ajax-----------------
loadSidebar_ajax();
addCategory_ajax();
addSource_ajax();
showSource_ajax();
showCategoryArticle_ajax();

//init-----------------
init();


//---------------------- function --------------------------

// 设置侧边栏高度、设置详细内容高度、等待加载高度
function setSidebarHeight(){
	var getHeight = document.documentElement.clientHeight;
	var sidebarHeight = getHeight - 50;
	var contentsDetailHeight = getHeight - 110;
	$(".rss-sidebar").height(sidebarHeight);
	$(".rss-contents-detail").height(contentsDetailHeight);
	$(".rss-loading-shade").height(sidebarHeight);
}

// 控制侧边栏菜单闭合
function sidebarControl(){
	$("body").on("click",'.rss-caret',function(){
		$.this = $(this);
		if($.this.hasClass("fa-caret-right")){
			$.this.removeClass("fa-caret-right").addClass("fa-caret-down");
			$.this.parent().children("ul").slideDown("fast");
		}else{
			$.this.removeClass("fa-caret-down").addClass("fa-caret-right");
			$.this.parent().children("ul").slideUp("fast");
		}
	});
}

// 控制拉取
function controlPull(){
	$("body").on("click",".rss-function-pull",function(){
		$(".rss-function").slideToggle("fast");
	});
}

// 添加rss选择分类
function chooseCategory(){
	$("body").on("change","#rss_choose_category",function(){
		$.this = $(this);
		$("#rss_hasChoose_category").html($.this.val());
	});
}

// 显示当前内容类别
function currentContents(){
	// 点击类别
	$("body").on("click",".rss-category-name",function(){
		var category_name = $(this).html();
		$("#rss_current_contents").empty().html('<span class="rss-current-contents">'+category_name+'</span>');
	});
	// 点击源标题
	$("body").on("click",".rss-category>ul>li",function(){
		$.this = $(this);
		var category_name = $.this.parent().parent().children(".rss-category-name").html();
		var source_name = $.this.children(".rss-source-name").html();
		$("#rss_current_contents").empty().html('<span class="rss-current-contents">'+category_name+'</span>'+
			'<span> > </span>'+
			'<span class="rss-current-contents">'+source_name+'</span>');
	});
	// 显示全部
	$("body").on("click",".rss-show-all",function(){
		$("#rss_current_contents").empty().html('<span class="rss-current-contents">全部文章</span>');
	});
	// 显示收藏夹
	$("body").on("click","#rss_favorite",function(){
		$("#rss_current_contents").empty().html('<span class="rss-current-contents">收藏夹</span>');
	});
}


//---------------- ajax -------------------
// 加载侧边栏、分类列表
function loadSidebar_ajax(){
	$.get("api/category_sidebar",function(data){
		var insertHtml_category = "";
		var option = "";
		for(var i=0; i < data.length; i++){
			// 如果没有二级目录
			var item = data[i];
			var insertHtml_source = "";
			if(item.source_set.length == 0){
				insertHtml_category +=
					'<li class="rss-category">'+
            		'<i class="fa fa-caret-right rss-caret" aria-hidden="true"></i>'+
            		'<img class="rss-category-image" src="../static/images/folder.png" />'+
            		'<span class="rss-category-name" id="category_'+ item.id +'" title="'+item.name+'">'+ item.name +'</span>'+
            		'<span class="rss-amount">'+ item.amount +'</span>'+
          			'</li>';
			}else{
				for (var j=0; j<item.source_set.length; j++){
					item_source = item.source_set[j];
					insertHtml_source +=
						'<li>'+
                		'<img class="rss-source-image" src="../static/images/rss.png" />'+
                		'<span class="rss-source-name" id="source_'+ item_source.id +'" title="'+item_source.name+'">'+item_source.name+'</span>'+
                		'<span class="rss-amount">'+item_source.amount+'</span>'+
              			'</li>';
				}
				insertHtml_category +=
					'<li class="rss-category">'+
            		'<i class="fa fa-caret-right rss-caret" aria-hidden="true"></i>'+
            		'<img class="rss-category-image" src="../static/images/folder.png" />'+
            		'<span class="rss-category-name" id="category_'+ item.id +'" title="'+item.name+'">'+ item.name +'</span>'+
            		'<span class="rss-amount">'+ item.amount +'</span>'+
					'<ul>'+ insertHtml_source +'</ul>'+
          			'</li>';
			}

			// 将获得的 category name 同时添加到“添加RSS源”分类列表里面
			if (i == 0){
				option = "<option value='"+item.name+"' selected='selected'>"+item.name+"</option>";
			}else{
				option += "<option value='"+item.name+"'>"+item.name+"</option>";
			}
		}

		if (insertHtml_category != ""){
			// 不等于空，则插入侧边栏菜单，否则显示默认
			$(".rss-sidebar>ul").html(insertHtml_category);
			// 同时添加到“添加RSS源”分类列表里面
			$("#rss_choose_category").html(option);
			// 同时初始化文章列表
			$("#category_1").click();
		}else{
			alert("初始化加载失败");
		}


	},"json");
}

// 添加类别
function addCategory_ajax(){
	$("#rss_add_category").click(function(){
		var input_category = $("#rss_input_category").val();
		if(input_category == ""){
			CommonFunction.addAlert("rss_add_category_alert","提示：请输入类别名称","0");
		}else{
			var category_input = $("#rss_input_category").val();
			var param = {
				"name":category_input
			};
			$.get("api/add_category",param,function(data){
				if(data.status == "400"){
					CommonFunction.addAlert("rss_add_category_alert","添加的类别：'"+category_input+"' 已经存在","0");
				}else if(data.status == "200"){
					CommonFunction.addAlert("rss_add_category_alert","添加类别：'"+category_input+"' 成功","1");
					$("#rss_input_category").val("");

					insertHtml_category =
						'<li class="rss-category">'+
						'<i class="fa fa-caret-right rss-caret" aria-hidden="true"></i>'+
						'<img class="rss-category-image" src="../static/images/folder.png" />'+
						'<span class="rss-category-name" id="category_'+ data.id +'" title="'+data.name+'">'+ data.name +'</span>'+
						'<span class="rss-amount">'+ data.amount +'</span>'+
						'</li>';

					$(".rss-sidebar>ul").append(insertHtml_category);
				}
			});
		}
	});
	$("#rss_add_category_button").click(function(){
		$("#rss_add_category_alert").css("display","none");
	});
}

// 添加rss源
function addSource_ajax(){
	$("#rss_add_source").click(function(){
		// 关闭解析完成的rss源
		$(".rss-source-input-name").css("display","none");

		var get_link = $("#rss_input_source").val();
		if (get_link == ""){
			CommonFunction.addAlert("rss_add_source_alert","提示：请输入RSS源地址","0");
		}else {
			$("#rss_add_source_alert").css("display","none");
			// 开启等待动画
			$(".rss-analyze-loading").css("display","inline-block");
			var param = {
				"rss_link":get_link
			};
			$.get("api/check_rssLink",param,function(data){
				// 关闭等待动画
				$(".rss-analyze-loading").css("display","none");
				if(data.status == "200"){
					CommonFunction.addAlert("rss_add_source_alert","RSS解析可用","1");
					$("#rss_source_input_name").val(data.title);
					$(".rss-source-input-name").css("display","block");
				}else if(data.status == "400"){
					CommonFunction.addAlert("rss_add_source_alert","RSS源已经存在","0");
				}else if(data.status == "404"){
					CommonFunction.addAlert("rss_add_source_alert","不是有效的RSS源","0");
				}else {
					alert("状态未处理");
				}
			},"json");
		}
	});

	$("#rss_add_source_submit").click(function(){
		var getSourceInput = $("#rss_input_source").val();
		var getJudge = $("#rss_add_source_alert");

		if(getSourceInput == ""){ //如果未输入rss地址
			// 提示输入rss源，并添加动画效果
			CommonFunction.addAlert("rss_add_source_alert","提示：请输入RSS源地址","0");
			CommonFunction.addAlertAnimation("rss_add_source_alert");
			$(".rss-source-input-name").css("display","none");

		}else if(getJudge.hasClass("rss-alert-warning")){ //如果校验错误
			// 添加动画效果
			CommonFunction.addAlertAnimation("rss_add_source_alert");
		}else if(getJudge.hasClass("rss-alert-success")){
			// 判断源名称是否为空
			if ($("#rss_source_input_name").val() == ""){
				// 添加错误动画效果
				CommonFunction.addAlertAnimation("rss_source_input_name");
			}else{
				// 可成功提交
				var getRssLink = $("#rss_input_source").val();
				var getRssName = $("#rss_source_input_name").val();
				var getCategory = $("#rss_choose_category").val()[0];
				var param = {
					"rss_link":getRssLink,
					"name":getRssName,
					"category":getCategory
				};
				$.get("api/add_rssLink",param,function(data){
					if(data.status == "200"){
						var getLi = $("#category_"+data.category_id).parent();
						var getUl = getLi.children("ul");
						if(getUl.length == "0"){
							getLi.append(
								'<ul><li>'+
								'<img class="rss-source-image" src="../static/images/rss.png" />'+
								'<span class="rss-source-name" id="source_'+ data.id +'" title="'+data.name+'">'+data.name+'</span>'+
								'<span class="rss-amount">'+data.amount+'</span>'+
								'</li></ul>'
							);
						}else{
							getUl.append(
								'<li>'+
								'<img class="rss-source-image" src="../static/images/rss.png" />'+
								'<span class="rss-source-name" id="source_'+ data.id +'" title="'+data.name+'">'+data.name+'</span>'+
								'<span class="rss-amount">'+data.amount+'</span>'+
								'</li>'
							);
						}

						// 清空表单
						$("#rss_input_source").val("");
                        $("#rss_add_source_alert").css("display","none");
                        $(".rss-source-input-name").css("display","none");
					}
				});
			}
		}
	});

	$("#rss_add_source_button").click(function(){
		$("#rss_add_source_alert").css("display","none");
		// 清空原来输入的rss地址
		$("#rss_input_source").val("");
		// 关闭解析完成的rss源
		$(".rss-source-input-name").css("display","none");
	});
}

// 显示源内容
function showSource_ajax(){
	// 点击源
	$("body").on("click",".rss-source-name",function(){
		$.this = $(this);
		id = CommonFunction.getId($.this.attr("id"));
		param = {
			"id" : id
		};
		$(".rss-loading-contents").css("display","block"); //loading
		$.get("api/show_article",param,function(data){
			initArticle(data[0]);
			$(".rss-loading-contents").css("display","none"); //cancel loading
		},"json");
	});
}

// 通过类别显示源内容
function showCategoryArticle_ajax(){
	$("body").on("click",".rss-category-name",function(){

		$.this = $(this);
		var id_arr = [];
		// 获得 source 数组
		var get_source_item = $.this.parent().find(".rss-source-name");
		for (var i = 0; i <get_source_item.length; i++){
			source_id = CommonFunction.getId(get_source_item[i].id);
			id_arr.push(source_id);
		}

		// 每页的长度
		var page_length = 20;
		var begin = 0;
		var end = begin + page_length;

		id_arr = JSON.stringify(id_arr);//将数组转化为json
		var param = {
			"id_arr":id_arr,
			"begin": begin,
			"end": end
		};

		$(".rss-loading-contents").css("display","block"); //loading
		$(".rss-contents-detail")[0].scrollTop = 0;
		$.get("api/show_category_article",param,function(data){
			initCategoryToArticle(data);
			$(".rss-loading-contents").css("display","none"); //loading
		});

		// 分页
		paginationArticle(id_arr, page_length);

	});
}

//-------------- basic ---------------------

// 更新文章内容(第一次加载)
function initArticle(data) {
	var articles = data["article_set"];
	var contents = "";
	for(var i=0; i < articles.length; i++){
		var article = articles[i];
		contents +=
			'<div class="rss-detail-layout col-lg-3 col-md-4 col-sm-6">'+
                '<div class="rss-detail-article">'+
                  '<h4 class="rss-detail-category">'+data["name"]+'</h4>'+
                  '<p class="rss-detail-title"><a href="'+article["link"]+'" target="_blank">'+ article["title"]+'</a></p>'+
                  '<p class="rss-detail-summary">'+
                     article["summary"] +
                  '</p>'+
                  '<div class="rss-detail-menu">'+
					'<span class="rss-star glyphicon glyphicon-star" title="收藏"></span>'+
                  '</div>'+
                '</div>'+
              '</div>'
	}
	// 先清空再添加
	var article_contents = $("#rss_article_contents");
	article_contents.html("");
	article_contents.append(contents);
}

// 更新分类的文章内容（第一次加载）
function initCategoryToArticle(data) {
	var articles = data;
	var contents = "";

	for(var i in articles){
		var article = articles[i];
		contents +=
			'<div class="rss-detail-layout col-lg-3 col-md-4 col-sm-6">'+
                '<div class="rss-detail-article">'+
                  '<h4 class="rss-detail-category">'+article.source_name+'</h4>'+
                  '<p class="rss-detail-title"><a href="'+article.link+'" target="_blank">'+ article.title+'</a></p>'+
                  '<p class="rss-detail-summary">'+
                     article.summary +
                  '</p>'+
                  '<div class="rss-detail-menu">'+
					'<span class="rss-star glyphicon glyphicon-star" title="收藏"></span>'+
                  '</div>'+
                '</div>'+
              '</div>'
	}
	// 先清空再添加
	var article_contents = $("#rss_article_contents");
	article_contents.html("");
	article_contents.append(contents);
}

// 分页加载文章
function appendCategoryToArticle(data) {
	var articles = data;
	var contents = "";

	for(var i in articles){
		var article = articles[i];
		contents +=
			'<div class="rss-detail-layout col-lg-3 col-md-4 col-sm-6">'+
                '<div class="rss-detail-article">'+
                  '<h4 class="rss-detail-category">'+article.source_name+'</h4>'+
                  '<p class="rss-detail-title"><a href="'+article.link+'" target="_blank">'+ article.title+'</a></p>'+
                  '<p class="rss-detail-summary">'+
                     article.summary +
                  '</p>'+
                  '<div class="rss-detail-menu">'+
					'<span class="rss-star glyphicon glyphicon-star" title="收藏"></span>'+
                  '</div>'+
                '</div>'+
              '</div>'
	}
	// 先清空再添加
	var article_contents = $("#rss_article_contents");
	article_contents.append(contents);
}

// 分页功能
function paginationArticle(id_arr, page_length){
	var contents_detail_div = $(".rss-contents-detail");
	var contain_scrollHeight = 0;
	var contain_scrollTop = 0;
	var contain_div_height = contents_detail_div.height();

	var times = 1;
	contents_detail_div.unbind("scroll").scroll(function(){
		$.this = $(this);
		contain_scrollHeight = $.this[0].scrollHeight;
		contain_scrollTop = $.this[0].scrollTop;

		var param = {
			"id_arr": id_arr,
			"begin": page_length * times,
			"end": page_length * (times + 1)
		};

		// 到达底部
		if(contain_div_height + contain_scrollTop >= contain_scrollHeight){
			$(".rss-loading-add").css("display","block"); //loading
			$.get("api/show_category_article", param, function(data) {
				appendCategoryToArticle(data);
				$(".rss-loading-add").css("display","none"); //loading
            },"json");
			times++;
		}
	});
}


});