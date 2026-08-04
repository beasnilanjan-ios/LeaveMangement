import {
  Platform,
} from 'react-native';


export const FontFamily = {
  regular: Platform.OS === 'ios' ? 'Poppins-Regular' : 'Poppins-Regular',
  bold: Platform.OS === 'ios' ? 'Poppins-Bold' : 'Poppins-Bold',
  medium: Platform.OS === 'ios' ? 'Poppins-Medium' : 'Poppins-Medium',
  semiBold: Platform.OS === 'ios' ? 'Poppins-SemiBold' : 'Poppins-SemiBold',
};