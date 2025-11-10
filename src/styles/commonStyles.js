import { StyleSheet } from 'react-native';
import { COLORS, SIZES } from './theme';

export const commonStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SIZES.paddingLarge,
    paddingTop: 60,
  },

  scrollContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  title: {
    fontSize: SIZES.title,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 8,
    textAlign: 'center',
  },

  subtitle: {
    fontSize: SIZES.large,
    color: COLORS.textDim,
    marginBottom: 24,
    textAlign: 'center',
  },

  card: {
    backgroundColor: COLORS.cardBg,
    borderRadius: SIZES.radius,
    padding: SIZES.paddingLarge,
    marginVertical: 10,
    width: '100%',
    borderWidth: SIZES.borderThin,
    borderColor: COLORS.borderLight,
  },

  cardTitle: {
    color: COLORS.primary,
    fontSize: SIZES.xlarge,
    fontWeight: '600',
    marginBottom: SIZES.paddingMedium,
  },

  label: {
    color: COLORS.textTertiary,
    fontSize: SIZES.medium,
    marginBottom: 8,
  },

  input: {
    backgroundColor: COLORS.inputBg,
    color: COLORS.text,
    padding: SIZES.paddingMedium,
    borderRadius: SIZES.radiusSmall,
    fontSize: SIZES.large,
    marginBottom: SIZES.padding,
    borderWidth: SIZES.borderThin,
    borderColor: COLORS.inputBorder,
  },

  infoText: {
    color: COLORS.textDim,
    fontSize: SIZES.medium,
    lineHeight: 20,
    marginVertical: 8,
  },

  button: {
    backgroundColor: COLORS.buttonPrimary,
    padding: SIZES.padding,
    borderRadius: SIZES.radiusSmall,
    marginTop: 20,
    width: '100%',
  },

  buttonDisabled: {
    backgroundColor: COLORS.buttonDisabled,
  },

  buttonText: {
    color: '#000',
    fontSize: SIZES.large,
    fontWeight: '700',
    textAlign: 'center',
  },

  buttonRow: {
    flexDirection: 'row',
    width: '100%',
    marginTop: 10,
  },
});
