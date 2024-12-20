// src/screens/HomeScreen.js
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  FlatList,
  Image,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  Animated
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

  const [cartCount, setCartCount] = useState(0);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('accessToken');
    navigation.replace('Login');
  };

  const renderPromotionItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.promotionCard}
      onPress={() => Alert.alert('Promotion', item.description)}
    >
      <Image 
        source={{ uri: item.image }} 
        style={styles.promotionImage}
      />
      <View style={styles.promotionOverlay}>
        <Text style={styles.promotionTitle}>{item.title}</Text>
        <Text style={styles.promotionDescription}>{item.description}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderProductItem = ({ item }) => (
    <TouchableOpacity
      style={styles.productCard}
      onPress={() => navigation.navigate('Payment', { product: item })}
    >
      <Text style={styles.discountText}>{item.discount}</Text>
      <Image 
        source={{ uri: item.image }} 
        style={styles.productImage}
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
          <Text style={styles.originalPrice}>₹{item.originalPrice}</Text>
          <Text style={styles.price}>₹{item.price}</Text>
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
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Chicken Shop</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity 
            style={styles.cartButton}
            onPress={() => Alert.alert('Cart', 'Cart functionality coming soon!')}
          >
            <Icon name="shopping-cart" size={24} color="#000" />
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
      </View>

      <ScrollView>
        <View style={styles.promotionsContainer}>
          <Text style={styles.sectionTitle}>Special Offers</Text>
          <FlatList
            horizontal
            data={promotions}
            renderItem={renderPromotionItem}
            keyExtractor={(item) => item.id.toString()}
            showsHorizontalScrollIndicator={false}
          />
        </View>

        <View style={styles.productsContainer}>
          <Text style={styles.sectionTitle}>Fresh Products</Text>
          {products.map(item => (
            <View key={item.id}>
              {renderProductItem({item})}
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd'
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  cartButton: {
    marginRight: 15
  },
  cartBadge: {
    position: 'absolute',
    right: -5,
    top: -5,
    backgroundColor: 'red',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  cartBadgeText: {
    color: 'white',
    fontSize: 12
  },
  logoutButton: {
    backgroundColor: '#ddd',
    padding: 8,
    borderRadius: 5
  },
  logoutText: {
    color: '#000'
  },
  promotionsContainer: {
    marginTop: 10
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    padding: 15
  },
  promotionCard: {
    width: 300,
    height: 150,
    marginHorizontal: 10,
    borderRadius: 10,
    overflow: 'hidden'
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
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10
  },
  promotionTitle: {
    color: 'white',
    fontWeight: 'bold'
  },
  promotionDescription: {
    color: 'white'
  },
  productCard: {
    margin: 10,
    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 2
  },
  productImage: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10
  },
  productDetails: {
    padding: 10
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  productDescription: {
    color: '#666',
    marginVertical: 5
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  rating: {
    marginLeft: 5
  },
  reviews: {
    color: '#666',
    marginLeft: 5
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10
  },
  originalPrice: {
    textDecorationLine: 'line-through',
    color: '#666'
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  buyButton: {
    backgroundColor: '#000',
    padding: 8,
    borderRadius: 5
  },
  buyButtonText: {
    color: 'white'
  },
  discountText: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'red',
    color: 'white',
    padding: 5,
    borderRadius: 5,
    zIndex: 1
  }
});

export default HomeScreen;