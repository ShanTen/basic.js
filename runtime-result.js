export class RTresult{
    constructor(){
        this.value = null;
        this.error = null;
    }

    register(res){
        if(res instanceof RTresult){
            if(res.error) this.error = res.error;
            return res.value;
        }
        return res;
    }

    success(value){
        this.value = value;
        return this;
    }

    /*Generic call for a runtime error, for which we will use the base error class*/
    failure(error){
        this.error = error;
        return this;
    }
}

