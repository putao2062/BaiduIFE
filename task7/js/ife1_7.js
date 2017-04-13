try {
    //ie8,'input:checked'参数报错，ie7不支持querySelector， 不支持则选择框显示默认的样式
    if (document.querySelector('input:checked'));
    var inputs = document.querySelectorAll('.customWrap input');

    for (var i = inputs.length - 1; i >= 0; i--) {
        inputs[i].style.visibility = 'hidden';
        inputs[i].style.marginTop = '6px';
    }
    var spans = document.querySelectorAll('.custom input + label span');
    for (var i = spans.length - 1; i >= 0; i--) {
        spans[i].style.visibility = 'visible';
    }
} catch (e) {
    console.log(e);
}
