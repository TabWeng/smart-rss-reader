/**
 * Created by tabweng on 2017/1/8.
 */

// 封装的通用方法
var CommonFunction = {

    // 正则表达式获得id
    getId:function(str){
        var re = /_(\d+)/;
        var matchResult = str.match(re);
        // 返回 abc_id 中的id
        return matchResult[matchResult.length - 1];
    },

    // 进行提示信息操作
    // info 为提示信息
    // id 为控制的节点id，status 为返回的状态，0 表示出错，1表示成功
    addAlert:function(id,info,status){

        if(status == "1"){
			$("#"+id+">.rss-alert-contents").html(info);
			var alert_icon = $("#"+id+">.glyphicon");
			if(alert_icon.hasClass("glyphicon-remove")){
				alert_icon.removeClass("glyphicon-remove").addClass("glyphicon-ok");
				$("#"+id).removeClass("rss-alert-warning").addClass("rss-alert-success");
			}
			$("#"+id).css("display","inline-block");

        }else if(status == "0"){
			$("#"+id+">.rss-alert-contents").html(info);
			var alert_icon = $("#"+id+">.glyphicon");
			if(alert_icon.hasClass("glyphicon-ok")){
				alert_icon.removeClass("glyphicon-ok").addClass("glyphicon-remove");
				$("#"+id).removeClass("rss-alert-success").addClass("rss-alert-warning");
			}
			$("#"+id).css("display","inline-block");
        }else{
            alert("未处理的状态");
        }
    },

	// 添加提示动画
	// id 为控制的 id 节点
	addAlertAnimation:function(id){
    	$("#"+id).addClass("rss-alert-hint");
    	setTimeout(function(){
			$("#"+id).removeClass("rss-alert-hint");
		},700);
	},

	// 获得当前分类器的id
	getFilterId:function(){
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
		return filter_id
	}

};

