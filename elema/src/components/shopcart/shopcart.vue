<template>
    <div class="shopcart">
        <div class="content" @click="toggleList">
            <div class="content-left">
                <div class="logo-wrapper">
                    <div class="logo" :class="{'highlight':totalCount>0}">
                        <span class="icon-shopping_cart"></span>
                    </div>
                    <div class="num" v-show="totalCount>0">{{totalCount}}</div>
                </div>
                <div class="price" :class="{'highlight':totalPrice>0}">￥{{totalPrice}}</div>
                <div class="desc">另需配送费￥{{deliveryPrice}}元</div>
            </div>
            <div class="content-right">
                <div class="pay" :class="payClass">
                    {{payDesc}}
                </div>
            </div>
        </div>
        <div class="ball-container">
            <!--<transition-group name="drop" class="ball" tag="div" @before-enter="beforeEnter" @enter="enter" @after-enter="afterEnter">
                <div v-for="ball in balls" v-show="ball.show" :key="ball">
                    <div class="inner inner-hook"></div>
                </div>                
            </transition-group>-->
            <transition v-for="ball in balls" name="drop" tag="div" @before-enter="beforeEnter" @enter="enter" @after-enter="afterEnter">
                <div v-show="ball.show" class="ball">
                    <div class="inner inner-hook"></div>
                </div>                
            </transition>
        </div>
        <transition name="fold">
            <div class="shopcart-list" v-show="listShow">
                <div class="list-header">
                    <h1 class="title">购物车</h1>
                    <span class="empty">清空</span>
                </div>
                <div class="list-content" ref="listContent">
                    <ul>
                        <li class="food" v-for="food in selectFoods">
                            <span class="name">{{food.name}}</span>
                            <div class="price">
                                <span>￥{{food.price*food.count}}</span>
                            </div>
                            <div class="cartcontrol-wrapper">
                                <cartcontrol :food="food"></cartcontrol>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </transition>
    </div>
</template>

<script type="text/javascript">
    import BScroll from 'better-scroll';

    import cartcontrol from 'components/cartcontrol/cartcontrol';

    const ERR_OK = 0;

    export default {
        props:{
            selectFoods: {
                typy: Array,
                default() {
                    return [
                        {
                            price:10,
                            count:2
                        }
                    ];
                }
            },
            deliveryPrice: {
                type: Number,
                default: 0
            },
            minPrice: {
                type: Number,
                default: 0
            }
        },
        data() {
            return {
                balls: [
                    {
                        show:false
                    },
                    {
                        show:false
                    },
                    {
                        show:false
                    },
                    {
                        show:false
                    },
                    {
                        show:false
                    }
                ],
                fold:true,
                dropBall: []
            }
        },
        computed: {
            // 总价
            totalPrice() {
                let total = 0;
                this.selectFoods.forEach((food) => {
                    total += food.price * food.count;
                });
                return total;
            },
            // 选中商品个数
            totalCount() {
                let count = 0;
                this.selectFoods.forEach((food) => {
                    count += food.count;
                });
                return count;
            },
            // 右侧显示
            payDesc() {
                if (this.totalPrice === 0) {
                    // ``es6写法，相当于 用+符号 连接
                    return `￥${this.minPrice}元起送`;
                }else if(this.totalPrice < this.minPrice){
                    let diff = this.minPrice - this.totalPrice;
                    return `还差${diff}元起送`;
                }else{
                    return '去结算';
                }
            },
            payClass() {
                if(this.totalPrice < this.minPrice){
                    return 'not-enough';
                }else{
                    return 'enough';
                }
            },
            // 购物车列表显示
            listShow() {
                if (!this.totalCount) {
                    this.fold = true;
                    return false;
                }
                let show = !this.fold;
                if (show){
                    this.$nextTick(() => {
                        if (!this.scroll) {
                            this.scroll = new BScroll(this.$refs.listContent, {
                                click:true
                            });
                        } else {
                            this.scroll.refresh();
                        }
                    });
                }
                return show;
            }
        },
        methods: {
            drop(el) {
                // console.log(el);
                for(let i=0; i<this.balls.length; i++) {
                    let ball = this.balls[i];
                    if(!ball.show) {
                        ball.show = true;
                        ball.el = el;
                        this.dropBall.push(ball);
                        return;
                    }
                }
            },
            toggleList() {
                if (!this.totalCount) {
                    return;  
                }
                this.fold = !this.fold;
            },
            beforeEnter(el) {
                let count = this.balls.length;
                while(count--) {
                    let ball = this.balls[count];
                    if(ball.show) {
                        // getBoundingClientRect()用于获得页面中某个元素的左，上，右和下分别相对浏览器视窗的位置
                        let rect = ball.el.getBoundingClientRect();
                        let x = rect.left - 32;
                        let y = -(window.innerHeight - rect.top - 22);
                        console.log(rect);
                        console.log(x);
                        console.log(y);
                        el.style.display = '';
                        // el.style.webkitTransform = `translate3d(0,${y}px,0)`;
                        // el.style.transform = `translate3d(0,${y}px,0)`;
                        // let inner = el.getElementsByClassName('inner-hook')[0];
                        // inner.style.webkitTransform = `translate3d(${x}px,0,0)`;
                        // inner.style.transform = `translate3d(${x}px,0,0)`;
                        el.style.webkitTransform = 'translate3d(0,-355px,0)';
                        el.style.transform = 'translate3d(0,-355px,0)';
                        let inner = el.getElementsByClassName('inner-hook')[0];
                        inner.style.webkitTransform = 'translate3d(298px,0,0)';
                        inner.style.transform = 'translate3d(298px,0,0)';
                    }
                }
            },
            enter(el, done) {
                // 浏览器重绘
                let rf = el.offestHeight;
                this.$nextTick(()=>{
                    el.style.webkitTransform = 'translate3d(0,0,0)';
                    el.style.transform = 'translate3d(0,0,0)';
                    let inner = el.getElementsByClassName('inner-hook')[0];
                    inner.style.webkitTransform = 'translate3d(0,0,0)';
                    inner.style.transform = 'translate3d(0,0,0)';
                });
                done();
            },
            afterEnter(el) {
                let ball = this.dropBall.shift();
                if(ball) {
                    ball.show = false;
                    el.style.display = 'none';
                }
            }
        },
        components: {
            cartcontrol
        }
    };
</script>

<style lang="scss" rel="stylesheet/scss">
    @import '../../common/sass/mixin';
    .shopcart {
        position: fixed;
        left: 0;
        bottom: 0;
        z-index: 50;
        width: 100%;
        height: 48px;
        /*background:#000;*/
        .content {
            display: flex;
            background: #141d27;
            font-size: 0;
            color: rgba(255, 255, 255, 0.4);
            .content-left {
                flex: 1;
                .logo-wrapper {
                    display: inline-block;
                    vertical-align: top;
                    position: relative;
                    top: -10px;
                    margin: 0 12px;
                    padding: 6px;
                    width: 56px;
                    height: 56px;
                    box-sizing: border-box;
                    background: #141d27;
                    border-radius: 50%;
                    .logo {
                        width: 100%;
                        height: 100%;
                        border-radius: 50%;
                        text-align: center;
                        background: #2b343c;
                        &.highlight {
                            background: rgb(0, 160, 220);
                            .icon-shopping_cart {
                                color: #fff;
                            }
                        }
                        .icon-shopping_cart {
                            line-height: 44px;
                            font-size: 24px;
                            color: #80858a;
                        }
                    }
                    .num {
                        position: absolute;
                        top: 0;
                        right: 0;
                        width: 24px;
                        height: 16px;
                        line-height: 16px;
                        text-align: center;
                        border-radius: 16px;
                        font-size: 9px;
                        font-weight: 700;
                        color: #fff;
                        background: rgb(240, 20, 20);
                        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.4);
                    }
                }
                .price {
                    display: inline-block;
                    vertical-align: top;
                    margin-top: 12px;
                    line-height: 24px;
                    padding-right: 12px;
                    box-sizing: border-box;
                    border-right: 1px solid rgba(255, 255, 255, 0.1);
                    font-size: 16px;
                    font-weight: 700;
                    &.highlight {
                        color: #fff;
                    }
                }
                .desc {
                    display: inline-block;
                    vertical-align: top;
                    margin: 12px 0 0 12px;
                    line-height: 24px;
                    color: rgba(255, 255, 255, 0.4);
                    font-size: 10px;
                }
            }
            .content-right {
                flex: 0 0 105px;
                width: 105px;
                .pay {
                    height: 48px;
                    line-height: 48px;
                    text-align: center;
                    font-size: 12px;
                    font-weight: 700;
                    background: #2b333b;
                    &.not-enough {
                        background: #2b333b;
                    }
                    &.enough {
                        background: #00b43c;
                        color: #fff;
                    }
                }
            }
        }
        .ball-container {
            .ball {
                position: fixed;
                left: 32px;
                bottom: 22px;
                z-index: 200;
                /*transition: all 0.4s;*/
                
                /*&.drop-enter, &.drop-leave-active {*/
                    transition: all 0.4s;
                    .inner {
                        width: 16px;
                        height: 16px;
                        border-radius: 50%;
                        background: rgb(0, 160, 220);
                        transition: all 0.4s;
                    }
                /*} */
            }
        }
        .shopcart-list {
            position: absolute;
            left: 0;
            top: 0;
            z-index: -1;
            width: 100%;
            transform: translate3d(0, -100%, 0);
            transition: all 0.5s;
            &.fold-enter-active,
            &.fold-leave {
                transform: translate3d(0, -100%, 0);
            }
            &.fold-enter,
            &.fold-leave-active {
                transform: translate3d(0, 0, 0)
            }
            .list-header {
                height: 40px;
                line-height: 40px;
                padding: 0 18px;
                background: #f3f5f7;
                border-bottom: 1px solid rgba(7, 17, 27, 0.1);
                .title {
                    float: left;
                    font-size: 14px;
                    color: rgb(7, 17, 27);
                }
                .empty {
                    float: right;
                    font-size: 12px;
                    color: rgb(0, 160, 220);
                }
            }
            .list-content {
                padding: 0 18px;
                max-height: 217px;
                overflow: hidden;
                background: #fff;
                .food {
                    position: relative;
                    padding: 12px 0;
                    box-sizing: border-box;
                    @include border-1px(rgba(7, 17, 27, 0.1));
                    .name {
                        line-height: 24px;
                        font-size: 14px;
                        color: rgb(7, 17, 27);
                    }
                    .price {
                        position: absolute;
                        right: 90px;
                        bottom: 12px;
                        line-height: 24px;
                        font-size: 14px;
                        font-weight: 700;
                        color: rgb(240, 20, 20);
                    }
                    .cartcontrol-wrapper {
                        position: absolute;
                        right: 0;
                        bottom: 6px;
                    }
                }
            }
        }
    }
</style>