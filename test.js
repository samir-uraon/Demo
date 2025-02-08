var t=0
var r;//global variable access directly


function ram(){
     var id =123// local variable. we can not access directly
    r=id
    console.log(r)
}
ram()
console.log(r)