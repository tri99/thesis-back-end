function Dnow(){
    return new Date().getTime();
}


const a = {"_id": 1, "a": 2}
for(var k in a){
    console.log(k, a[k]);
}

module.exports = {
    Dnow:Dnow
}
