(function (params,factory) {
    // global.DatePicker = factory();
    params.DatePicker = factory();
}(this,function(){
    var DatePicker = function (el,options) {
        //默认设置
        var defaultOptions = {
            disabled:false,
            callback:function () {
            }
        }
        //获取当前时间的date
        var date = new Date();
        var title = {
            year:date.getFullYear(),//年
            month:date.getMonth()+1//月
        }
        var state = {
            year: date.getFullYear(),//年
            month: date.getMonth() + 1,//月
            date: date.getDate()//日
        }
        //配置设置
        var params = {};
        options = options || {};

        for (var key in defaultOptions) {
        params[key] = defaultOptions[key];
        }

        if (typeof options === 'function') {
            params.callback = options;
        } else {
            for (var o in options) {
                if (options.hasOwnProperty(o)) {
                params[o] = options[o];
                }
            }
        }
        //清空el元素
        if (typeof el === 'string') {
            el = document.querySelector(el);
          }
      
        el.innerHTML = '';
       
        //设置日期标题
        var theadTtileDom = (function () {
            var theadTitles = ['一','二','三','四','五','六','日']
            //创建thead Title             
            var theadEl = createEl('ul','dateTabul');
            // var tr = createEl('li');
            var th;
            for(var num=0;num<theadTitles.length;num++){
                th = createEl('li','dateTabli');
                th.textContent = theadTitles[num];
                theadEl.appendChild(th);
            }
            // theadEl.appendChild(tr);
            return theadEl;
        })()
        
        //设置日期表格
        var setTableDom = function (day,week) {
            //确定这一天是星期几
            var week = (week === 0) ? 7 : week;
            //确定一个月有多少行数据显示ul 
            //2个阀值  28 1  31 7
            var len = Math.ceil((week-1+day)/7);
            var num = 0 ;
            var max =0;
            //给每行都填充一个数据span
            var tableDiv = createEl('div');
            for(var i=0;i<len;i++){
                var ul = createEl('ul','dateTabul')
                for(var j=0;j<7;j++){
                    var li = createEl('li','dateTabli')
                    var a = createEl('a','date-select')
                    a.href = "#"
                    ++max
                    if (num>=day|| max < week) {
                        // a.textContent = ''
                        // li.appendChild(a)
                        ul.appendChild(li)
                        continue
                    }
                    ++num
                    a.textContent = num
                    a.dataset.index = num;
                    if (num==state.date&&title.month==state.month&&title.year==state.year) {
                        a.classList.add('is-active')
                    }
                    li.appendChild(a)
                    ul.appendChild(li)
                }
                tableDiv.appendChild(ul)
            }
            return tableDiv
        }
        // el.appendChild(theadTtileDom)
        //增加日历控制按钮
        var dom = function () {
            //左右两个箭头加中间时间显示
            var leftTimeBtn = createEl('a','date-prev')
            leftTimeBtn.innerHTML ='&#xe667;'
            leftTimeBtn.href = "#"
            leftTimeBtn.classList.add('iconfont')
            var rightTimeBtn = createEl('a','date-next')
            rightTimeBtn.innerHTML ='&#xe600;'
            rightTimeBtn.href = "#"
            rightTimeBtn.classList.add('iconfont')
            var timeTitleDiv = createEl('div','date-title')
            var yearSpan = createEl('span')
            var monthSpan = createEl('span')
            var timeHeardDiv = createEl('div','timeHeardDiv')
            var timeTableDiv= createEl('div')
            var timeBoxDiv = createEl('div')
            //日历设置栏
            timeHeardDiv.appendChild(leftTimeBtn)
            timeTitleDiv.appendChild(yearSpan)
            timeTitleDiv.appendChild(monthSpan)
            timeHeardDiv.appendChild(timeTitleDiv)
            timeHeardDiv.appendChild(rightTimeBtn)
            //更新日历表格
            var dateTimeTable=function (year,month)  {
                timeTableDiv.innerHTML = '';
                timeTableDiv.appendChild(theadTtileDom)
                var date = new Date(title.year, title.month - 1, 1);
                timeTableDiv.appendChild(setTableDom(getMonth(year,month).day,date.getDay()));
            }
            //更新时间表格
            var updata = function () {
                //设置用户输入的时间
                if (params.currentDate) {
                    var datetime = params.currentDate.split('-')
                    datetime[0] = parseInt(datetime[0]);
                    datetime[1] = parseInt(datetime[1]);
                    datetime[2] = parseInt(datetime[2]);
                    title.year = state.year = parseInt(datetime[0]);
                    title.month = state.month = parseInt(datetime[1]);
                    title.date = state.date = parseInt(datetime[2]);  
                }
                yearSpan.textContent = title.year;
                monthSpan.textContent =getMonth(title.year,title.month).month ;
                dateTimeTable(title.year,title.month)
            }
            updata()
            timeBoxDiv.appendChild(timeHeardDiv)
            timeBoxDiv.appendChild(timeTableDiv)
            timeBoxDiv.addEventListener('click',function (e) {
                //点击选中一个日期元素
                var target = e.target;
                //获取全部元素
                var elAll = this.querySelectorAll('.date-select');
               
                if (target.tagName) {
                    if (target.classList.contains('date-select')) {
                        if (!target.classList.contains('is-active')) {//选中
                            for (var i=0; i < elAll.length; i++) {//去除之前的选中
                                if (elAll[i].classList.contains('is-active')) {
                                  elAll[i].classList.remove('is-active');
                                }
                            }
                            state.year = title.year;
                            state.month = title.month;
                            state.date = parseInt(target.dataset.index);
                            target.classList.add('is-active')
                            // params.currentDate=null;
                        }
                        //回调函数传值
                        params.callback(state);
                        e.preventDefault();
                        return;
                    }else if(target.className=='date-prev iconfont') {//上个月
                        //把时间改成上个月
                        if (title.month > 1) {
                            --title.month;
                        }else{
                            yearSpan.textContent = --title.year;
                            title.month = 12;
                        }
                        // yearSpan.textContent = ++title.year;
                        // monthSpan.textContent = ++title.month % 13 || 1
                    }else if (target.className =='date-next iconfont') {//下个月
                        //把时间改成下个月
                        if (title.month === 12) {
                            yearSpan.textContent = ++title.year;
                        }
                        title.month = ++title.month % 13 || 1
                        // yearSpan.textContent = ++title.year;
                    }else{
                        return;
                    }
                    monthSpan.textContent = getMonth(title.year,title.month).month;
                    dateTimeTable(title.year,title.month)
                }
            })
            el.appendChild(timeBoxDiv)
        }
        dom()
        // setTableDom(31,1);
        // el.appendChild(theadTtileDom)
        // el.appendChild(setTableDom(28,7))
        // console.log(str)
    }
     


    //创建元素
    function createEl(el, className) {
        var  el =  document.createElement(el)
        if (className) {
            el.className = className;
        }
        return el
    }
    //返回对应月份有多少天
    function getMonth(years,month) {
        var date = new Date(years,month,0);
        //对应月份有的天数
        var day = date.getDate();
        //月份数组
        var monthTitle = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
        return {day:day,month:monthTitle[month-1]}
    }

    return DatePicker
}));