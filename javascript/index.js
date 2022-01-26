let productModal;
let delProductModal;

const app = {
    data() {
        return {
            baseUrl: 'https://vue3-course-api.hexschool.io/v2',
            apiPath: 'yunei',
            products: [],
            isNew: true,
            productTemp: {
                imagesUrl: [],
            },            
        };
    },
    methods: {
        checkLogin() {
            const url = `${this.baseUrl}/api/user/check`
            axios.post(url)
                .then(res => {
                    this.getProducts();
                })
                .catch(error => {
                    alert(error.data.message);
                    window.location = 'login.html';
                })
        },
        getProducts() {
            const url = `${this.baseUrl}/api/${this.apiPath}/admin/products`;
            axios.get(url)
                .then(res => {
                    this.products = res.data.products;
                })
                .catch(error => {
                    console.log(error.data);
                })
        },        
        openModal(status, item) {
            if (status === 'new') {                
                this.productTemp = {
                    imagesUrl: [],
                };
                productModal.show();
                this.isNew = true;
            } else if (status === 'edit') {
                this.productTemp = JSON.parse(JSON.stringify(item));
                productModal.show();
                this.isNew = false;
            } else if (status === 'del') {
                this.productTemp = {...item};
                delProductModal.show();
            }
        },
        createImages() {
            if (this.productTemp.imagesUrl) {
                this.productTemp.imagesUrl.push('');
            } else {
                this.productTemp.imagesUrl = [];
                this.productTemp.imagesUrl.push('');
            }            
        },
        updateProduct() {
            let url = `${this.baseUrl}/api/yunei/admin/product/${this.productTemp.id}`;
            let http = 'put';
            if (this.isNew) {
                url = `${this.baseUrl}/api/yunei/admin/product`;
                http = 'post';
            }
            axios[http](url, { data: this.productTemp })
                .then(res => {
                    productModal.hide();
                    alert(res.data.message);
                    this.getProducts();
                })
                .catch(error => {
                    alert(error.data.message);
                })
        },
        delProduct() {
            const url = `${this.baseUrl}/api/yunei/admin/product/${this.productTemp.id}`;
            axios.delete(url)
                .then(res => {
                    alert(res.data.message);
                    delProductModal.hide();
                    this.getProducts();
                })
                .catch(error => {
                    alert(error.data.message);
                })
        },
        changeIsEnabled(item) {
            const url = `${this.baseUrl}/api/yunei/admin/product/${item.id}`;
            axios.put(url, { data: item })
                .then(res => {
                    alert(res.data.message);
                    this.getProducts();
                })
                .catch(error => {
                    alert(error.data.message);
                })
        },
        toThousands(price) {
            return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }
    },
    mounted() {
        productModal = new bootstrap.Modal(document.getElementById('productModal'));
        delProductModal = new bootstrap.Modal(document.getElementById('delProductModal'));

        const token = document.cookie.replace(/(?:(?:^|.*;\s*)hextoken\s*\=\s*([^;]*).*$)|^.*$/, "$1");
        axios.defaults.headers.common['Authorization'] = token;
        this.checkLogin();
    }
  };
  
  Vue.createApp(app).mount("#app");
  