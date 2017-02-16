<template>
    <div class="goods">
        <div class="menu-wrapper">
            <ul>
                <li v-for="item in goods" class="menu-item">
                    <span class="text">
                        <span v-show="item.type>0" class="icon" :class="classMap[item.type]"></span>
                        {{item.name}}
                    </span>
                </li>
            </ul>
        </div>
        <div class="foods-wrapper"></div>
    </div>
</template>

<script type="text/javascript">
    const ERR_OK = 0;

    export default {
        props:{
            seller:{
                type:Object
            }
        },
        data() {
            return {
                goods: []
            };
        },
        created() {
            this.$http.get('/api/goods').then((response) => {
                response = response.body;
                if(response.errno === ERR_OK){
                    this.goods = response.data;
                }
            });
            this.classMap = ['decrease','discount','guarantee','invoice','special']
        }
    };
</script>

<style lang="scss" rel="stylesheet/scss">
    .goods{
        position: absolute;
        top:174px;
        bottom: 46px;
        width:100%;
        overflow: hidden;
        display: flex;
        .menu-wrapper{
            flex:0 0 80px;
            width:80px;
            background:#f3f5f7;
            .menu-item{
                display:table;
                height: 54px;
                width:56px;
                line-height: 54px;
                .icon{
                    display: inline-block;
                    vertical-align: middle;
                    width:12px;
                    height:12px;
                    margin-right:4px;
                    background-size:12px 12px;
                    background-repeat:no-repeat;
                    &.decrease{
                        @include bg-image('decrease_1');
                    }
                    &.discount{
                        @include bg-image('discount_1');                        
                    }
                    &.guarantee{
                        @include bg-image('guarantee_1');                        
                    }
                    &.invoice{
                        @include bg-image('invoice_1');                         
                    }
                    &.special{
                        @include bg-image('special_1');                         
                    }
                }
            }
        }
        .foods-wrapper{
            flex:1;
        }

    }
</style>