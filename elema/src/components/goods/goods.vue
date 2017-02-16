<template>
    <div class="goods">
        <div class="menu-wrapper" ref="menuwrapper">
            <ul>
                <li v-for="(item,index) in goods" class="menu-item" :class="{'current':currentIndex===index}" @click="selectMenu(index,$event)">
                    <span class="text border-1px">
                        <span v-show="item.type>0" class="icon" :class="classMap[item.type]"></span>                    {{item.name}}
                    </span>
                </li>
            </ul>
        </div>
        <div class="foods-wrapper" ref="foodswrapper">
            <ul>
                <!--hook只是用来表明会被js选择-->
                <li v-for="item in goods" class="food-list food-list-hook">
                    <h1 class="title">{{item.name}}</h1>
                    <ul>
                        <li @click="selectFood(food,$event)" v-for="food in item.foods" class="food-item border-1px">
                            <div class="icon">
                                <img :src="food.icon" width="57" height="57" alt="">
                            </div>
                            <div class="content">
                                <h2 class="name">{{food.name}}</h2>
                                <p class="desc">{{food.description}}</p>
                                <div class="extra">
                                    <span class="count">月售{{food.sellCount}}份</span>
                                    <span>好评率{{food.rating}}%</span>
                                </div>
                                <div class="price">
                                    <span class="now">￥{{food.price}}</span>
                                    <span v-show="food.oldPrice" class="old">￥{{food.oldPrice}}</span>
                                </div>
                                <div class="cartcontrol-wrapper">
                                    <cartcontrol :food="food"></cartcontrol>
                                </div>
                            </div>
                        </li>
                    </ul>
                </li>
            </ul>
        </div>
        <shopcart ref="shopcart" :select-foods="selectFoods" :delivery-price="seller.deliveryPrice" :min-price="seller.minPrice"></shopcart>
        <food :food="selectedFood" ref="food"></food>
    </div>
</template>

<script type="text/javascript">
    import BScroll from 'better-scroll';
    import shopcart from 'components/shopcart/shopcart';
    import cartcontrol from 'components/cartcontrol/cartcontrol';
    import food from 'components/food/food';

    const ERR_OK = 0;

    export default {
        props:{
            seller:{
                type:Object
            }
        },
        data() {
            return {
                goods: [],
                listHeight: [],
                scrollY:0,
                selectedFood:{}
            };
        },
        // 计算属性
        computed: {
            currentIndex() {
                for (let i = 0; i < this.listHeight.length; i++) {
                    let height1 = this.listHeight[i];
                    let height2 = this.listHeight[i + 1];
                    if(!height2 || this.scrollY >= height1 && this.scrollY < height2) {
                        return i;
                    }
                }
                return 0;
            },
            selectFoods() {
                let foods = [];
                this.goods.forEach((good) => {
                    good.foods.forEach((food) => {
                        if (food.count) {
                            foods.push(food);
                        }
                    });
                });
                return foods;
            }
        },
        created() {
            this.$http.get('/api/goods').then((response) => {
                response = response.body;
                if(response.errno === ERR_OK){
                    this.goods = response.data;
                    // dom更新
                    this.$nextTick(() => {
                        this._initScroll();
                        this._calculateHeight();
                    });
                }
            });
            this.classMap = ['decrease','discount','guarantee','invoice','special'];
            this.$root.eventHub.$on('cart.add', this.cartAdd);
        },
        beforeDestroy() {
            this.$root.eventHub.$off('cart.add', this.cartAdd);
        },
        methods: {
            selectMenu(index, event) {
                if(!event._constructed) {
                    return;
                }
                let foodList = this.$refs.foodswrapper.getElementsByClassName('food-list-hook');
                let el = foodList[index];
                this.foodsScroll.scrollToElement(el,300);
                console.log(index);
            },
            selectFood(food, event) {
                if(!event._constructed) {
                    return;
                }
                this.selectedFood = food;
                this.$refs.food.show();
            },
            // 购物车小球
            _drop(target) {
                this.$refs.shopcart.drop(target);
            },
            // 用better-scroll插件来实现滚动
            _initScroll() {
                // $refs获取DOM
                this.menuScroll = new BScroll(this.$refs.menuwrapper, {
                    //启用click事件
                    click: true
                });
                // probeType: 1 滚动的时候会派发scroll事件，会截流。2滚动的时候实时派发scroll事件，不会截流。 3除了实时派发scroll事件，在swipe的情况下仍然能实时派发scroll事件
                this.foodsScroll = new BScroll(this.$refs.foodswrapper, {
                    click: true,
                    probeType:3
                });

                this.foodsScroll.on('scroll', (pos)=>{
                    // abs取绝对值
                    this.scrollY = Math.abs(Math.round(pos.y));
                })
            },
            // 获取右侧每块的高度
            _calculateHeight() {
                let foodList = this.$refs.foodswrapper.getElementsByClassName('food-list-hook');
                let height = 0;
                this.listHeight.push(height);
                for (let i = 0; i < foodList.length; i++) {
                    let item = foodList[i];
                    height += item.clientHeight;
                    this.listHeight.push(height);
                }
            },
            // 购物车小球
            cartAdd(target) {
                this._drop(target);
            }
        },
        components: {
            shopcart,
            cartcontrol,
            food
        },
        events: {
            'cart.add'(target){
                this._drop(target);
            }
        }
    };
</script>

<style lang="scss" rel="stylesheet/scss">
    @import '../../common/sass/mixin';
    .goods {
        position: absolute;
        top: 174px;
        bottom: 46px;
        width: 100%;
        overflow: hidden;
        /*overflow: auto;*/
        display: flex;
        .menu-wrapper {
            flex: 0 0 80px;
            width: 80px;
            background: #f3f5f7;
            .menu-item {
                display: table;
                height: 54px;
                width: 56px;
                padding: 0 12px;
                line-height: 14px;
                &.current {
                    position: relative;
                    z-index: 10;
                    margin-top: -1px;
                    background: #fff;
                    font-weight: 700;
                    .text {
                        @include border-none();
                    }
                }
                .icon {
                    display: inline-block;
                    vertical-align: middle;
                    width: 12px;
                    height: 12px;
                    margin-right: 2px;
                    background-size: 12px 12px;
                    background-repeat: no-repeat;
                    &.decrease {
                        @include bg-image('decrease_3');
                    }
                    &.discount {
                        @include bg-image('discount_3');
                    }
                    &.guarantee {
                        @include bg-image('guarantee_3');
                    }
                    &.invoice {
                        @include bg-image('invoice_3');
                    }
                    &.special {
                        @include bg-image('special_3');
                    }
                }
                .text {
                    display: table-cell;
                    width: 56px;
                    vertical-align: middle;
                    @include border-1px(rgba(7, 17, 27, 0.1));
                    font-size: 12px;
                }
            }
        }
        .foods-wrapper {
            flex: 1;
            .title {
                padding-left: 14px;
                height: 26px;
                line-height: 26px;
                border-left: 2px solid #d9dde1;
                font-size: 12px;
                color: rgb(147, 153, 159);
                background: #f3f5f7;
            }
            .food-item {
                display: flex;
                margin: 18px;
                padding-bottom: 18px;
                @include border-1px(rgba(7, 17, 27, 0.1));
                &:last-child {
                    @include border-none();
                    margin-bottom: 0;
                }
                .icon {
                    flex: 0 0 57px;
                    margin-right: 20px;
                }
                .content {
                    flex: 1;
                    .name {
                        margin: 2px 0 8px;
                        height: 14px;
                        line-height: 14px;
                        font-size: 14px;
                        color: rgb(7, 17, 27);
                    }
                    .desc,
                    .extra {
                        line-height: 10px;
                        font-size: 10px;
                        color: #93999f;
                    }
                    .desc {
                        line-height: 12px;
                        margin-bottom: 8px;
                    }
                    .extra {
                        .count {
                            margin-right: 10px;
                        }
                    }
                    .price {
                        font-weight: 700;
                        line-height: 24px;
                        .now {
                            margin-right: 8px;
                            font-size: 14px;
                            color: rgb(240, 20, 20);
                        }
                        .old {
                            text-decoration: line-through;
                            font-size: 10px;
                            color: rgb(147, 153, 159);
                        }
                    }
                    .cartcontrol-wrapper {
                        position: absolute;
                        right: 0;
                        bottom: 12px;
                    }
                }
            }
        }
    }
</style>