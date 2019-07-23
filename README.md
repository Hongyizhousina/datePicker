# datePicker
一个简单是日期选择器 
```
  使用方法
  var datePick = DatePicker(el,
      {
      currentDate: '2017-03-15',
      callback: function(date){
        showtime.textContent = date.year + '-' + date.month + '-' + date.date
      }});
  el:可以是 ID,class或者 dom对象
  currentDate:显示的时间
  callback:回调函数
```
