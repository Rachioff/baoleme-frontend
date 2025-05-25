<!-- src/views/user/home/Home.vue -->
<template>
  <div class="home-container">
    <!-- 顶部搜索栏 -->
    <div class="search-bar">
      <n-space align="center" :size="12">
        <n-button quaternary circle @click="showLocationPicker = true">
          <n-icon size="18"><environment-outlined /></n-icon>
        </n-button>
        <div class="location-text" @click="showLocationPicker = true">
          {{ currentLocation }}
          <n-icon size="12"><down-outlined /></n-icon>
        </div>
      </n-space>
      <div class="search-input-wrapper" @click="router.push('/search')">
        <n-icon size="16"><search-outlined /></n-icon>
        <n-input
          placeholder="搜索商家、美食"
          readonly
        />
        <n-button
          class="search-button"
          @click.stop="router.push('/search')"
        >
          搜索
        </n-button>
      </div>
    </div>

    <!-- 轮播图 -->
    <div class="banner-wrapper">
      <n-carousel
        autoplay
        dot-type="line"
        show-arrow
        :interval="3000"
        class="banner"
      >
        <n-carousel-item v-for="(banner, index) in banners" :key="index">
          <img :src="banner.image" :alt="banner.title" class="banner-image" />
        </n-carousel-item>
      </n-carousel>
    </div>

    <!-- 功能入口 -->
    <div class="feature-entries">
      <div class="entry-item" v-for="(item, index) in featureEntries" :key="index" @click="handleEntryClick(item)">
        <div class="entry-icon" :style="{ backgroundColor: item.bgColor }">
          <n-icon size="20" :color="item.iconColor"><component :is="item.icon" /></n-icon>
        </div>
        <div class="entry-text">{{ item.title }}</div>
      </div>
    </div>

    <!-- 活动卡片 -->
    <div class="activity-cards">
      <div class="activity-card" v-for="(activity, index) in activities" :key="index">
        <div class="activity-content">
          <div class="activity-title">{{ activity.title }}</div>
          <div class="activity-desc">{{ activity.description }}</div>
        </div>
        <div class="activity-image">
          <img :src="activity.image" :alt="activity.title" />
        </div>
      </div>
    </div>

    <!-- 热门商家 -->
    <div class="section-title">
      <span>热门商家</span>
      <n-button text size="small" @click="router.push('/stores')">
        查看全部
        <template #icon>
          <n-icon><right-outlined /></n-icon>
        </template>
      </n-button>
    </div>

    <div class="store-list">
      <div class="store-item" v-for="(store, index) in recommendedStores" :key="index" @click="router.push(`/store/${store.id}`)">
        <div class="store-image">
          <img :src="store.image" :alt="store.name" />
          <div v-if="store.promotion" class="promotion-tag">{{ store.promotion }}</div>
        </div>
        <div class="store-info">
          <div class="store-name">{{ store.name }}</div>
          <div class="store-rating">
            <n-rate readonly size="small" :value="store.rating" />
            <span class="rating-text">{{ store.rating }}</span>
            <span class="monthly-sales">月售{{ store.monthlySales }}单</span>
          </div>
          <div class="store-delivery">
            <span class="delivery-fee">配送费¥{{ store.deliveryFee }}</span>
            <span class="divider">|</span>
            <span class="delivery-time">{{ store.deliveryTime }}分钟</span>
          </div>
          <div class="store-tags">
            <n-tag v-for="(tag, tagIndex) in store.tags" :key="tagIndex" size="small" :bordered="false" :color="{ color: '#FFF5F0', textColor: '#FF6B01', borderColor: '#FFE4D3' }">
              {{ tag }}
            </n-tag>
          </div>
        </div>
      </div>
    </div>

    <!-- 猜你喜欢 -->
    <div class="section-title">
      <span>猜你喜欢</span>
    </div>

    <div class="recommendation-list">
      <div class="recommendation-item" v-for="(item, index) in recommendations" :key="index" @click="router.push(`/store/${item.storeId}?product=${item.id}`)">
        <div class="recommendation-image">
          <img :src="item.image" :alt="item.name" />
        </div>
        <div class="recommendation-info">
          <div class="recommendation-name">{{ item.name }}</div>
          <div class="recommendation-store">{{ item.storeName }}</div>
          <div class="recommendation-price-sales">
            <div class="recommendation-price">¥{{ item.price }}</div>
            <div class="recommendation-sales">已售{{ item.sales }}+</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 位置选择模态框 -->
    <n-modal
      v-model:show="showLocationPicker"
      preset="card"
      title="选择收货地址"
      style="width: 90%; max-width: 500px;"
      :bordered="false"
      :segmented="{ content: true }"
    >
      <div class="location-list">
        <div class="location-header">
          <n-icon size="18"><environment-filled /></n-icon>
          <span>当前定位</span>
        </div>
        <div class="current-location-item" @click="selectLocation('北京航空航天大学-学生宿舍区')">
          <div class="location-name">北京航空航天大学-学生宿舍区</div>
          <div class="location-address">北京市海淀区学院路37号</div>
        </div>
        
        <div class="location-header">
          <n-icon size="18"><pushpin-filled /></n-icon>
          <span>收货地址</span>
        </div>
        <div 
          v-for="(address, index) in savedAddresses" 
          :key="index"
          class="location-item"
          @click="selectLocation(address.name)"
        >
          <div class="location-info">
            <div class="location-name">{{ address.name }}</div>
            <div class="location-address">{{ address.address }}</div>
          </div>
          <div class="location-tag">{{ address.tag }}</div>
        </div>
        
        <n-button block type="primary" class="add-address-btn" @click="router.push('/user/address')">
          添加新地址
        </n-button>
      </div>
    </n-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { 
  EnvironmentOutlined, 
  DownOutlined, 
  SearchOutlined, 
  RightOutlined,
  HomeFilled,
  FileTextOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  EnvironmentFilled,
  PushpinFilled,
  FireFilled,
  GiftFilled,
  ShopFilled,
  StarFilled,
  CoffeeOutlined,
  ShoppingOutlined,
  TeamOutlined,
  BulbOutlined
} from '@vicons/antd'

const router = useRouter()
const currentLocation = ref('北京航空航天大学-学生宿舍区')
const showLocationPicker = ref(false)

// 轮播图数据(后续设计)
const banners = ref([
  {
    title: "校园专享优惠",
    image: "https://placehold.co/600x200/FFF5F0/FF6B01?text=校园专享优惠"
  },
  {
    title: "新用户立减10元",
    image: "https://placehold.co/600x200/FFF5F0/FF6B01?text=新用户立减10元"
  },
  {
    title: "限时满减活动",
    image: "https://placehold.co/600x200/FFF5F0/FF6B01?text=限时满减活动"
  }
])

// 功能入口数据
const featureEntries = ref([
  {
    title: "美食专区",
    icon: CoffeeOutlined,
    bgColor: "#FFE4D3",
    iconColor: "#FF6B01",
    path: "/category/food"
  },
  {
    title: "超市便利",
    icon: ShoppingOutlined,
    bgColor: "#E6F7FF",
    iconColor: "#1890FF",
    path: "/category/market"
  },
  {
    title: "拼团优惠",
    icon: TeamOutlined,
    bgColor: "#F6FFED",
    iconColor: "#52C41A",
    path: "/group-buy"
  },
  {
    title: "校园榜单",
    icon: StarFilled,
    bgColor: "#FFF7E6",
    iconColor: "#FAAD14",
    path: "/rankings"
  }
])

// 活动卡片数据
const activities = ref([
  {
    title: "新人专享",
    description: "首单立减8元",
    image: "https://placehold.co/100x100/FFF5F0/FF6B01?text=新人专享"
  },
  {
    title: "限时满减",
    description: "满30减31元",
    image: "https://placehold.co/100x100/FFF5F0/FF6B01?text=限时满减"
  }
])

// 推荐商家数据(后端获取，这里只做占位)
const recommendedStores = ref([
  {
    id: 1,
    name: "老北京炸酱面",
    rating: 4.8,
    monthlySales: 238,
    deliveryFee: 3,
    deliveryTime: 30,
    distance: 1.2,
    promotion: "满20减5",
    image: "https://placehold.co/200x200/FFF5F0/FF6B01?text=老北京炸酱面",
    tags: ["校园专送", "米其林轮胎推荐"]
  },
  {
    id: 2,
    name: "川湘居",
    rating: 4.6,
    monthlySales: 186,
    deliveryFee: 4,
    deliveryTime: 35,
    distance: 1.5,
    promotion: "首单减10",
    image: "https://placehold.co/200x200/FFF5F0/FF6B01?text=川湘居",
    tags: ["口味好评", "分量足"]
  },
  {
    id: 3,
    name: "醉心烤鸭",
    rating: 4.9,
    monthlySales: 312,
    deliveryFee: 6,
    deliveryTime: 40,
    distance: 2.0,
    promotion: "满50减12",
    image: "https://placehold.co/200x200/FFF5F0/FF6B01?text=醉心烤鸭",
    tags: ["人气爆款", "招牌烤鸭"]
  }
])

// 推荐商品数据(同上)
const recommendations = ref([
  {
    id: 101,
    storeId: 1,
    name: "经典老北京炸酱面",
    storeName: "老北京炸酱面",
    price: 22,
    sales: 589,
    image: "https://placehold.co/400x300/FFF5F0/FF6B01?text=炸酱面"
  },
  {
    id: 202,
    storeId: 2,
    name: "麻辣香锅套餐",
    storeName: "川湘居",
    price: 38,
    sales: 435,
    image: "https://placehold.co/400x300/FFF5F0/FF6B01?text=麻辣香锅"
  },
  {
    id: 303,
    storeId: 3,
    name: "北京烤鸭半套",
    storeName: "醉心烤鸭",
    price: 88,
    sales: 328,
    image: "https://placehold.co/400x300/FFF5F0/FF6B01?text=烤鸭"
  },
  {
    id: 104,
    storeId: 1,
    name: "海鲜炒面",
    storeName: "老北京炸酱面",
    price: 32,
    sales: 246,
    image: "https://placehold.co/400x300/FFF5F0/FF6B01?text=海鲜炒面"
  }
])

// 收货地址数据
const savedAddresses = ref([
  {
    id: 1,
    name: "北京航空航天大学-学生宿舍区",
    address: "北京市海淀区学院路37号",
    tag: "学校"
  },
  {
    id: 2,
    name: "北京航空航天大学-教学楼",
    address: "北京市海淀区学院路37号",
    tag: "教室"
  },
  {
    id: 3,
    name: "北京航空航天大学-图书馆",
    address: "北京市海淀区学院路37号",
    tag: "图书馆"
  }
])

// 选择位置
const selectLocation = (location: string) => {
  currentLocation.value = location
  showLocationPicker.value = false
}

// 处理功能入口点击
const handleEntryClick = (item: any) => {
  router.push(item.path)
}

onMounted(() => {
  // 这里可以添加页面加载时的初始化逻辑
  // 比如获取用户位置、获取推荐商家列表等，后续再做
})
</script>

<style scoped>
.home-container {
  padding-bottom: 60px; /* 为底部导航留出空间 */
}

/* 搜索栏样式 */
.search-bar {
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background-color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.location-text {
  font-size: 14px;
  display: flex;
  align-items: center;
  cursor: pointer;
}

.search-input-wrapper {
  flex: 1;
  display: flex;
  align-items: center;
  background-color: #fff;
  border-radius: 8px;
  padding: 0 12px;
  margin-left: 10px;
}
.search-input-wrapper .n-icon {
  color: #999;
  margin-right: 8px;
}

.search-button {
  margin-left: 12px;
  background-color: #ff6b01;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 0 16px;
  height: 32px;
}

/* 轮播图样式 */
.banner-wrapper {
  margin: 12px 16px;
  border-radius: 8px;
  overflow: hidden;
}

.banner {
  height: 150px;
  border-radius: 8px;
}

.banner-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
}

/* 功能入口样式 */
.feature-entries {
  display: flex;
  justify-content: space-between;
  padding: 16px;
  background-color: white;
  margin-bottom: 12px;
}

.entry-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 25%;
}

.entry-icon {
  width: 48px;
  height: 48px;
  border-radius: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
}

.entry-text {
  font-size: 12px;
  color: #333;
}

/* 活动卡片样式 */
.activity-cards {
  display: flex;
  justify-content: space-between;
  padding: 0 16px;
  margin-bottom: 16px;
}

.activity-card {
  width: 48%;
  background-color: #fff5f0;
  border-radius: 8px;
  padding: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.activity-title {
  font-size: 16px;
  font-weight: bold;
  color: #ff6b01;
  margin-bottom: 4px;
}

.activity-desc {
  font-size: 12px;
  color: #ff6b01;
}

.activity-image {
  width: 50px;
  height: 50px;
}

.activity-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 4px;
}

/* 章节标题样式 */
.section-title {
  padding: 0 16px;
  margin: 20px 0 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.section-title span {
  font-size: 18px;
  font-weight: bold;
  position: relative;
  padding-left: 12px;
}

.section-title span:before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 16px;
  background-color: #ff6b01;
  border-radius: 2px;
}

/* 商家列表样式 */
.store-list {
  padding: 0 16px;
}

.store-item {
  display: flex;
  padding: 16px 0;
  border-bottom: 1px solid #f0f0f0;
}

.store-image {
  width: 80px;
  height: 80px;
  border-radius: 4px;
  overflow: hidden;
  position: relative;
  margin-right: 12px;
  flex-shrink: 0;
}

.store-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.promotion-tag {
  position: absolute;
  top: 0;
  left: 0;
  background-color: #ff6b01;
  color: white;
  font-size: 12px;
  padding: 2px 6px;
  border-radius: 0 0 4px 0;
}

.store-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.store-name {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 6px;
}

.store-rating {
  display: flex;
  align-items: center;
  font-size: 12px;
  margin-bottom: 6px;
}

.rating-text {
  margin: 0 4px 0 2px;
  color: #ff6b01;
}

.monthly-sales {
  color: #999;
}

.store-delivery {
  font-size: 12px;
  color: #666;
  margin-bottom: 6px;
}

.divider {
  margin: 0 6px;
}

.store-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

/* 推荐列表样式 */
.recommendation-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  padding: 0 16px;
}

.recommendation-item {
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.recommendation-image {
  height: 120px;
  overflow: hidden;
}

.recommendation-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.recommendation-info {
  padding: 8px;
}

.recommendation-name {
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.recommendation-store {
  font-size: 12px;
  color: #999;
  margin-bottom: 4px;
}

.recommendation-price-sales {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.recommendation-price {
  font-size: 16px;
  color: #ff6b01;
  font-weight: bold;
}

.recommendation-sales {
  font-size: 12px;
  color: #999;
}


/* 位置选择模态框样式 */
.location-list {
  max-height: 60vh;
  overflow-y: auto;
}

.location-header {
  display: flex;
  align-items: center;
  color: #999;
  font-size: 14px;
  margin: 12px 0;
}

.location-header span {
  margin-left: 6px;
}

.current-location-item, .location-item {
  padding: 12px;
  border-radius: 8px;
  background-color: #f9f9f9;
  margin-bottom: 12px;
  cursor: pointer;
}

.current-location-item {
  border-left: 3px solid #ff6b01;
}

.location-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.location-name {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 4px;
}

.location-address {
  font-size: 12px;
  color: #999;
}

.location-tag {
  padding: 2px 8px;
  background-color: #FFF5F0;
  color: #FF6B01;
  border-radius: 12px;
  font-size: 12px;
}

.add-address-btn {
  margin-top: 16px;
  background-color: #ff6b01;
}


</style>