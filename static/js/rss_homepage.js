$(function(){

//dynamic--------------
setSidebarHeight();
sidebarControl();
controlPull();
chooseCategory();
currentContents();
controlFilterSwitch();
chooseFilterResult();

//ajax-----------------
loadSidebar_ajax();
addCategory_ajax();
addSource_ajax();
showSource_ajax();
showCategoryArticle_ajax();
statusChange_ajax();
addFilter_ajax();
trainFilter_ajax();

//init-----------------
initLoading();


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
		$("#rss_current_contents").empty().html('<span id="show_current_category" class="rss-current-contents">'+category_name+'</span>');
	});
	// 点击源标题
	$("body").on("click",".rss-category>ul>li",function(){
		$.this = $(this);
		var category_name = $.this.parent().parent().children(".rss-category-name").html();
		var source_name = $.this.children(".rss-source-name").html();
		$("#rss_current_contents").empty().html('<span id="show_current_category" class="rss-current-contents">'+category_name+'</span>'+
			'<span> > </span>'+
			'<span id="show_current_source" class="rss-current-contents">'+source_name+'</span>');
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

// 初始化加载
function initLoading(){
	// 初始化标题加载
	function titleLoad(){
		$(".rss-loading-all").animate({
			"opacity" : 0
		},1000,function(){
			$(this).css("display","none");
		});
	}
	setTimeout(titleLoad, 2000);
	$(".rss-loading-all>img").animate({
		"opacity":1
	},500);


}

// 控制分类器开关
function controlFilterSwitch(){
	// 打开
	$("#filter_open").click(function(){
		$.this = $(this);
		var close_btn = $("#filter_close");
		if(!$.this.hasClass("btn-success")){
			$.this.removeClass("btn-default").addClass("btn-success");
			close_btn.removeClass("btn-success").addClass("btn-default");

			$(".rss-filter-result>button").removeAttr("disabled").removeClass("rss-forbid-btn");

			// 默认为推荐状态
			$("#filter_recommend").click();
		}
	});
	// 关闭
	$("#filter_close").click(function(){
		$.this = $(this);
		var open_btn = $("#filter_open");
		if(!$.this.hasClass("btn-success")){
			$.this.removeClass("btn-default").addClass("btn-success");
			open_btn.removeClass("btn-success").addClass("btn-default");

			$(".rss-filter-result>button").attr("disabled","disabled").addClass("rss-forbid-btn");
		}
	});
}

// 选择推荐还是过滤
function chooseFilterResult(){
	// 推荐
	$("#filter_recommend").click(function(){
		$.this = $(this);
		var filter = $("#filter_filter");
		if(!$.this.hasClass("btn-info")){
			$.this.removeClass("btn-default").addClass("btn-info");
			filter.removeClass("btn-info").addClass("btn-default");
		}
	});
	// 过滤
	$("#filter_filter").click(function(){
		$.this = $(this);
		var recommend = $("#filter_recommend");
		if(!$.this.hasClass("btn-info")){
			$.this.removeClass("btn-default").addClass("btn-info");
			recommend.removeClass("btn-info").addClass("btn-default");
		}
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
		var category_input = $("#rss_input_category").val();
		if(category_input == ""){
			CommonFunction.addAlert("rss_add_category_alert","提示：请输入类别名称","0");
		}else{
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

					// 更新显示到页面
					$(".rss-sidebar>ul").append(insertHtml_category);
					// 更新到RSS源添加的分类中
					var option = "<option value='"+data.name+"'>"+data.name+"</option>";
					$("#rss_choose_category").append(option);
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
		var id = CommonFunction.getId($.this.attr("id"));
		var id_arr = [];
		id_arr.push(id);

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
		$.get("api/show_article",param,function(data){
			initArticle(data[0]);
			$(".rss-loading-contents").css("display","none"); //cancel loading
		},"json");

		// 分页
		paginationArticle(id_arr, page_length,"source");

		//不可添加过滤组
		$("#rss_add_filter").css("display","none");
	});
}

// 通过类别显示源内容
function showCategoryArticle_ajax(){
	$("body").on("click",".rss-category-name",function(){

		$.this = $(this);
		var id_arr = [];
		// 获得 source 数组
		var get_source_item = $.this.parent().find(".rss-source-name");

		// 如果类别中没有源，则直接停止查询
		if(get_source_item.length == "0"){
			var article_contents = $("#rss_article_contents");
			article_contents.html("");
			return;
		}

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
		paginationArticle(id_arr, page_length, "category");

		// 可以添加过滤组(显示过滤组按钮)
		$("#rss_add_filter").css("display","block");
		// 显示过滤组的下拉选项
		var category_id = CommonFunction.getId($.this.attr("id"));
		showFilterGroup_ajax(category_id,"all");


	});
}

// 改变文章的状态
function statusChange_ajax(){
	$.body = $("body");

	// 点击文章的按钮，改变状态
	$.body.on("click",".rss-article-button",function(){
		$.this = $(this);
		var id = CommonFunction.getId($.this.attr("id"));

		// 如果是未读状态，则改为已读状态
		if($.this.hasClass("rss-status-button-neverRead")){
			setArticleStatus_ajax(id,"toAlreadyRead",$.this);
			// 如果是已读状态，则把状态改为未读
		}else if($.this.hasClass("rss-status-button-alreadyRead")){
			setArticleStatus_ajax(id,"toNeverRead",$.this);
		}else{
			console.log("no find the true status");
		}
	});

	// 点击文章的按钮，改变为已知状态
	$.body.on("click",".rss-detail-title>a",function(){
		$.this = $(this);
		var id = CommonFunction.getId($.this.attr("id"));
		// 设为已读
		var getChangeElement = $.this.parent().parent().find(".rss-article-button");

		if(getChangeElement.val() == "未读"){
				setArticleStatus_ajax(id,"toAlreadyRead",getChangeElement);
		}
	});
}

// 添加过滤组
function addFilter_ajax(){
	$("#rss_add_filter").click(function(){
		// 获取三个数据框节点、一个提示框
		var rss_input_filter_name = $("#rss_input_filter_name");
		var rss_filter_input = $("#rss_filter_input");
		var keyWord_contain = $("#rss_filter_keyWord_contain");
		var rss_add_filter_alert = $("#rss_add_filter_alert");
		// 先清空原来的数据
		rss_input_filter_name.val("");
		rss_filter_input.val("");
		keyWord_contain.empty();
		rss_add_filter_alert.css("display","none");

		var check = false;
		// 输入框失去焦点时进行校验
		rss_input_filter_name.blur(function(){
			var filter_name = $(this).val();

			if(filter_name == ""){
				CommonFunction.addAlert("rss_add_filter_alert","请输入过滤组名称","0");
			}else{
				var param = {
					"filter_name":filter_name
				};
				// 后台请求检测
				$.get("api/check_filterName",param,function(data){
					if(data.status == "200"){
						check = true;
						rss_add_filter_alert.css("display","none");
					}else if(data.status == "400"){
						// 提示已经存在
						CommonFunction.addAlert("rss_add_filter_alert","添加的过滤组：'"+filter_name+"' 已经存在","0");
					}else {
						// 提示未知错误
						CommonFunction.addAlert("rss_add_filter_alert","添加的过滤组名称存在未知错误","0");
					}
				},'json');
			}
		});

		// 添加核心词到容器中
		rss_filter_input.on("input",function(){
			$.this = $(this);
			var get_keyWord = $.this.val();
			var re = /[,|，]/g;
			var keyWord_arr = get_keyWord.split(re);
			if(keyWord_arr.length > 1){
				var get_all_keyWord = $(".rss-keyWord-label");
				for (var i=0; i<keyWord_arr.length-1; i++){
					// 校验输入是否已经存在，若存在，则不进行操作
					var flag = true;
					for(var j=0; j<get_all_keyWord.length; j++){
						if(keyWord_arr[i] == get_all_keyWord.eq(j).html()){
							flag = false;
							break;
						}
					}
					if(!flag){
						$.this.val("");
						continue;
					}

					// 插入核心词
					var keyWord_item =
						'<div class="rss-filter-keyWord-item">'+
							'<span class="rss-keyWord-label">'+keyWord_arr[i].toLowerCase()+'</span>'+
							'<span class="rss-filter-icon-remove glyphicon glyphicon-remove" aria-hidden="true"></span>'+
						'</div>';
					keyWord_contain.prepend(keyWord_item);
				}
				// 清零
				$.this.val("");
			}
		});

		// remove核心词
		$("body").on('click','.rss-filter-icon-remove',function(){
			$(this).parent().remove();
		});

		// 提交添加
		$("#filter_submit").unbind("click").click(function(){
			if(check == true){
				// 获得当前category的name
				var category_name = $("#show_current_category").html();
				// 获得输入的filter的name
				var filter_name = rss_input_filter_name.val();
				// 获得关键词数组
				var keyWord_arr = [];
				var get_keyWord_element = $(".rss-keyWord-label");
				for(var i=0; i<get_keyWord_element.length; i++){
					keyWord_arr.push(get_keyWord_element.eq(i).html());
				}
				keyWord_arr = JSON.stringify(keyWord_arr);
				// json格式的参数
				var param = {
					"category_name" : category_name,
					"filter_name" : filter_name,
					"keyWord_arr" : keyWord_arr
				};
				// 提交等待动画
				$(".rss-add-filter-loading").css("display","block");
				$.get("api/add_filter",param,function(data){
					if(data.status == "200"){
						CommonFunction.addAlert("rss_add_filter_alert","过滤组 '"+category_name+"' 添加成功","1");
						// 清空
						rss_input_filter_name.val("");
						rss_filter_input.val("");
						keyWord_contain.empty();
					}else{
						CommonFunction.addAlert("rss_add_filter_alert","添加失败","0");
					}
					// 关闭动画
					$(".rss-add-filter-loading").css("display","none");
				},'json');
				check = false;
			}
		});
	});
}

// 获得可训练的文章
function trainFilter_ajax(){
	// 初次加载
	$("#rss_filter_train").click(function(){
		// 滚动条回到初始化状态
		$(".rss-train-table")[0].scrollTop = 0;
		var current_filter = $("#rss_filter").val();
		$("#train_target").html(current_filter);
		$("#filter_current_name").html(current_filter);
		// 加载训练文章
		loadTrainArticles(0,20);
	});

	// 加载更多
	var load_time = 1;
	var load_length = 20;
	$("#train_more").click(function(){
		var begin_num = load_length * load_time;
		loadTrainArticles(begin_num, load_length);
		load_time += 1;
	});

	// 选中核心词
	$("body").on("click",".rss-train-key",function(){
		$.this = $(this);
		if($.this.hasClass("rss-key-check")){
			$.this.removeClass("rss-key-check");
		}else{
			$.this.addClass("rss-key-check");
		}
	});

}

//-------------- ajax basic ----------------
// 设置为已读状态
	// 参数 id 为要设置为已读的文章的id
	// 参数 targetStatus 是要成为的目标状态
	// 参数 changeElement 是要修改为目标状态的节点
function setArticleStatus_ajax(id,targetStatus, changeElement){
	var status = 0;
	if(targetStatus == "toAlreadyRead"){
		status = 1;
	}else if(targetStatus == "toNeverRead"){
		status = 0;
	}else{
		console.log("status err");
	}

	var param = {
		"id":id,
		"status":status
	};
	$.get("api/update_article_status",param,function(data){
		if(data.status == "200"){
			if(status == 1){
				// 修改为目标状态
				changeElement.removeClass("rss-status-button-neverRead").addClass("rss-status-button-alreadyRead").attr("value","已读");
			}else if(status == 0){
				changeElement.removeClass("rss-status-button-alreadyRead").addClass("rss-status-button-neverRead").attr("value","未读");
			}else{}

		}else{
			console.log("status change err");
		}
	});
}

// 显示过滤组的选项
	// 参数 category_id 为要显示的类别的过滤组
	// 参数 source_id 为只显示的二级菜单，若果是类别，则为 "all"
function showFilterGroup_ajax(category_id, source_id){
	var param = {
		"category_id":category_id,
		"source_id":source_id
	};
	$.get("api/show_filterGroup", param, function(data){
		var select_filter = $("#rss_filter");
		if(data.status == "200"){
			var filters = data.filters;
			var options = "";
			for (var i in filters){
				filter = filters[i];
				options += '<option id="filter_'+filter.id+'" value="'+filter.name+'">'+filter.name+'</option>';
			}
			select_filter.empty();
			select_filter.append(options);
			$("#rss_filter_train").removeAttr("disabled");

		}else{
			select_filter.empty();
			$("#rss_filter_train").attr("disabled","disabled");
			console.log("show filter error.");
		}
	},'json');
}

// 加载训练文章
	// 参数 filter_id 为要加载的文章的类别的id
	// 参数 begin 分片开始的位置，是一个数字
	// 参数 load_length 为要加载的文章长度
function loadTrainArticles(begin, load_length){
		// 获得filter的id
		var filter_id = "";
		var get_select = $("#rss_filter");
		for (var i in get_select.children()){
			var myOption = get_select.children().eq(i);
			if(myOption.val() == get_select.val()){
				filter_id = myOption.attr("id");
				break;
			}
		}
		filter_id = CommonFunction.getId(filter_id);

		var end = begin + load_length;
		var param = {
			"filter_id":filter_id,
			"begin":begin,
			"end":end
		};

		$.get("api/get_filter_train_article",param,function(data){

			if(data.status == "200"){
				var contents = "";
				var articles = data.articles;
				for (var i in articles){
					var article = articles[i];

					// 获得关键词html元素
					var keyWord_list = eval(article.key_word);
					var keyWord_element = "";
					for (var j = 0; j < keyWord_list.length; j++){
						keyWord_element += '<span class="rss-train-key">'+keyWord_list[j]+'</span>';
					}

					contents +=
						'<tr>'+
							'<td class="rss-train-check">'+
							  '<div class="checkbox checkbox-success">'+
								'<input type="checkbox" id="checkbox_'+article.id+'"><label for="checkbox_'+article.id+'"></label>'+
							  '</div>'+
							'</td>'+
							'<td>'+
							  '<div class="rss-train-article-title"><p>'+article.title+'</p></div>'+
							  '<div class="rss-train-article-summary">'+
								'<p>'+ article.summary +'</p>'+
							  '</div>'+
							  '<div class="rss-train-article-keyWord">'+
								'<span class="rss-train-style-1">关键词：</span>'+
									keyWord_element+
							  '</div>'+
							'</td>'+
						'</tr>';
				}

				// 是初次加载还是追加载
				var train_contain = $("#filter_train_contain");
				if(begin == 0){
					train_contain.empty();
					train_contain.append(contents);
				}else{
					train_contain.append(contents);
				}

			}else{
				console.log("train data load error");
			}
		},'json');

}

//-------------- basic ---------------------

// 更新文章内容(针对source, 第一次加载)
function initArticle(data) {
	// 正序（必须要转行为逆序）
	var articles = data["article_set"];
	var contents = "";

	// 转为逆序（因为前端是逆序显示）
	for(var i=0; i < articles.length; i++){
		var article = articles[i];
		contents +=
			'<div class="rss-detail-layout col-lg-3 col-md-4 col-sm-6">'+
                '<div class="rss-detail-article">'+
                  '<h4 class="rss-detail-category">'+data["name"]+'</h4>'+
                  '<p class="rss-detail-title"><a href="'+article["link"]+'" target="_blank"'+' id="link_'+article["id"]+'">'+ article["title"]+'</a></p>'+
                  '<p class="rss-detail-summary">'+
                     article["summary"] +
                  '</p>'+
                  '<div class="rss-detail-menu">'+
					'<input id="button_'+article["id"]+'" type="button" class="rss-article-button rss-status-button-neverRead" value="未读">'+
                  '</div>'+
                '</div>'+
              '</div>'
	}
	// 先清空再添加
	var article_contents = $("#rss_article_contents");
	article_contents.html("");
	article_contents.append(contents);
}
// 分页加载文章（针对source）
function appendToArticle(data){
	// 正序（必须要转行为逆序）
	var articles = data["article_set"];
	var contents = "";

	// 转为逆序（因为前端是逆序显示）
	for(var i=0; i < articles.length; i++){
		var article = articles[i];
		contents +=
			'<div class="rss-detail-layout col-lg-3 col-md-4 col-sm-6">'+
                '<div class="rss-detail-article">'+
                  '<h4 class="rss-detail-category">'+data["name"]+'</h4>'+
                  '<p class="rss-detail-title"><a href="'+article["link"]+'" target="_blank"'+' id="link_'+article["id"]+'">'+ article["title"]+'</a></p>'+
                  '<p class="rss-detail-summary">'+
                     article["summary"] +
                  '</p>'+
                  '<div class="rss-detail-menu">'+
					'<input id="button_'+article["id"]+'" type="button" class="rss-article-button rss-status-button-neverRead" value="未读">'+
                  '</div>'+
                '</div>'+
              '</div>'
	}
	// 直接在后面添加
	var article_contents = $("#rss_article_contents");
	article_contents.append(contents);
}

// 更新分类的文章内容（针对category, 第一次加载）
function initCategoryToArticle(data) {
	var articles = data;
	var contents = "";

	for(var i in articles){
		var article = articles[i];
		contents +=
			'<div class="rss-detail-layout col-lg-3 col-md-4 col-sm-6">'+
                '<div class="rss-detail-article">'+
                  '<h4 class="rss-detail-category">'+article.source_name+'</h4>'+
                  '<p class="rss-detail-title"><a href="'+article.link+'" target="_blank"'+' id="link_'+article.id+'">'+ article.title+'</a></p>'+
                  '<p class="rss-detail-summary">'+
                     article.summary +
                  '</p>'+
                  '<div class="rss-detail-menu">'+
						'<input id="button_'+article.id+'" type="button" class="rss-article-button rss-status-button-neverRead" value="未读">'+
                  '</div>'+
                '</div>'+
              '</div>'
	}
	// 先清空再添加
	var article_contents = $("#rss_article_contents");
	article_contents.html("");
	article_contents.append(contents);
}
// 分页加载文章（针对category）
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
					'<input id="button_'+article.id+'" type="button" class="rss-article-button rss-status-button-neverRead" value="未读">'+
                  '</div>'+
                '</div>'+
              '</div>'
	}
	// 在最后添加
	var article_contents = $("#rss_article_contents");
	article_contents.append(contents);
}

// 分页功能
	// way 是分页的选择，一共有 category 和 source 两种
function paginationArticle(id_arr, page_length, way){
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

			if(way == "category"){
				$.get("api/show_category_article", param, function(data) {
					appendCategoryToArticle(data);
					$(".rss-loading-add").css("display","none"); //cancel loading
				},"json");
			}else if(way == "source"){
				$.get("api/show_article",param,function(data){
					appendToArticle(data[0]);
					$(".rss-loading-add").css("display","none"); //cancel loading
				},"json");
			}else{}

			times++;
		}
	});
}

});
