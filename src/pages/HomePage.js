// src/screens/HomeScreen.js
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  FlatList, 
  Image, 
  StyleSheet, 
  SafeAreaView,
  ScrollView,
  Dimensions,
  Animated,
  Pressable
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';

const HomeScreen = ({ navigation }) => {
  const [products] = useState([
    {
      id: 1,
      name: 'Fresh Whole Chicken',
      description: 'Farm-fresh whole chicken, sourced from local farms',
      price: 499,
      originalPrice: 599,
      discount: '17% OFF',
      rating: 4.8,
      reviews: 245,
      image: 'https://images.unsplash.com/photo-1587593810167-a84920ea0781'
    },
    {
      id: 2,
      name: 'Premium Chicken Breasts',
      description: 'Premium boneless chicken breasts, perfect for grilling',
      price: 299,
      originalPrice: 399,
      discount: '25% OFF',
      rating: 4.9,
      reviews: 189,
      image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791'
    }
  ]);

  const [promotions] = useState([
    {
      id: 1,
      title: 'Weekend Special',
      description: 'Get 20% off on all products',
      image: 'https://images.unsplash.com/photo-1602491674275-316d95560fb1'
    },
    {
      id: 2,
      title: 'Bulk Order Discount',
      description: 'Order above ₹2000 and get free delivery',
      image: 'https://images.unsplash.com/photo-1501200291289-c5a76c232e5f'
    }
  ]);

  const [scrollY] = useState(new Animated.Value(0));
  const [cartCount, setCartCount] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('accessToken');
    navigation.replace('Login');
  };

  const renderPromotionItem = ({ item }) => (
    <Pressable 
      style={({ pressed }) => [
        styles.promotionCard,
        pressed && { transform: [{ scale: 0.98 }] }
      ]}
      onPress={() => Alert.alert('Promotion', item.description)}
    >
      <Image 
        source={{ uri: item.image }} 
        style={styles.promotionImage}
        resizeMode="cover"
      />
      <View style={styles.promotionOverlay}>
        <Text style={styles.promotionTitle}>{item.title}</Text>
        <Text style={styles.promotionDescription}>{item.description}</Text>
      </View>
    </Pressable>
  );

  const renderProductItem = ({ item }) => (
    <Pressable
      style={({ pressed }) => [
        styles.productCard,
        pressed && { transform: [{ scale: 0.98 }] }
      ]}
      onPress={() => {
        setSelectedProduct(item);
        navigation.navigate('Payment', { product: item });
      }}
    >
      <View style={styles.discountBadge}>
        <Text style={styles.discountText}>{item.discount}</Text>
      </View>
      <Image 
        source={{ uri: item.image }} 
        style={styles.productImage}
        resizeMode="cover" 
      />
      <View style={styles.productDetails}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productDescription}>{item.description}</Text>
        <View style={styles.ratingContainer}>
          <Icon name="star" size={16} color="#FFB74D" />
          <Text style={styles.rating}>{item.rating}</Text>
          <Text style={styles.reviews}>({item.reviews} reviews)</Text>
        </View>
        <View style={styles.priceContainer}>
          <View>
            <Text style={styles.originalPrice}>₹{item.originalPrice}</Text>
            <Text style={styles.price}>₹{item.price}</Text>
          </View>
          <TouchableOpacity 
            style={styles.buyButton}
            onPress={() => {
              setCartCount(prev => prev + 1);
              navigation.navigate('Payment', { product: item });
            }}
          >
            <Text style={styles.buyButtonText}>Buy Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Pressable>
  );

  const headerHeight = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [80, 50],
    extrapolate: 'clamp',
  });

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={[styles.header, { height: headerHeight }]}>
        <Text style={styles.headerTitle}>Chicken Shop</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity 
            style={styles.cartButton}
            onPress={() => Alert.alert('Cart', 'Cart functionality coming soon!')}
          >
            <Icon name="shopping-cart" size={24} color="#FF9800" />
            {cartCount > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{cartCount}</Text>
              </View>
            )}
          </TouchableOpacity>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

      <Animated.ScrollView
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.promotionsContainer}>
          <Text style={styles.sectionTitle}>Special Offers</Text>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={promotions}
            renderItem={renderPromotionItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.promotionsList}
          />
        </View>

        <View style={styles.productsContainer}>
          <Text style={styles.sectionTitle}>Fresh Products</Text>
          <FlatList
            data={products}
            renderItem={renderProductItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.productList}
            scrollEnabled={false}
          />
        </View>
      </Animated.ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF3E0'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#FFF',
    elevation: 4,
    shadowColor: '#FF9800',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    zIndex: 1000
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF9800'
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  cartButton: {
    marginRight: 15,
    padding: 5
  },
  cartBadge: {
    position: 'absolute',
    right: -5,
    top: -5,
    backgroundColor: '#F57C00',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  cartBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold'
  },
  logoutButton: {
    backgroundColor: '#FF5722',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8
  },
  logoutText: {
    color: 'white',
    fontWeight: 'bold'
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    padding: 15,
    color: '#E65100'
  },
  promotionsContainer: {
    marginTop: 10
  },
  promotionsList: {
    paddingHorizontal: 10
  },
  promotionCard: {
    width: Dimensions.get('window').width * 0.8,
    height: 150,
    marginHorizontal: 5,
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 5,
    backgroundColor: '#FFF'
  },
  promotionImage: {
    width: '100%',
    height: '100%'
  },
  promotionOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255,152,0,0.8)',
    padding: 15
  },
  promotionTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold'
  },
  promotionDescription: {
    color: 'white',
    fontSize: 14
  },
  productsContainer: {
    marginTop: 20
  },
  productList: {
    padding: 10
  },
  productCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    marginBottom: 15,
    elevation: 4,
    shadowColor: '#FF9800',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    position: 'relative'
  },
  discountBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#FF5722',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    zIndex: 1
  },
  discountText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12
  },
  productImage: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20
  },
  productDetails: {
    padding: 15
  },
  productName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#E65100'
  },
  productDescription: {
    color: '#795548',
    marginVertical: 5,
    fontSize: 14
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5
  },
  rating: {
    marginLeft: 5,
    fontWeight: 'bold',
    color: '#F57C00'
  },
  reviews: {
    marginLeft: 5,
    color: '#795548'
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10
  },
  originalPrice: {
    fontSize: 16,
    color: '#795548',
    textDecorationLine: 'line-through'
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF9800'
  },
  buyButton: {
    backgroundColor: '#FF9800',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#FF9800',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  buyButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16
  }
});

export default HomeScreen;