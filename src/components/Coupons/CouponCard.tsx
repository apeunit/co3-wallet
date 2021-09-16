import React from 'react';
import { Box, Flex, Image, Text } from 'rebass';

const CouponCard = ({ coupon }: { coupon: any }) => {
    const metadata = coupon.logoURL && coupon.logoURL.includes('description') && JSON.parse(coupon.logoURL);
    return (
        <Flex sx={{
            borderRadius: '8px',
            overflow: 'hidden',
            borderStyle: 'solid',
            borderWidth: 1,
            marginBottom: '10px'
        }}>
            <Box sx={{
                width: 80,
                minHeight: 80,
            }}>
                <Image
                    src={metadata.logoURL}
                    sx={{
                        objectFit: 'cover',
                        width: '100%',
                        height: '100%'
                    }}
                />
            </Box>
            <Box color="#000000" sx={{
                width: '70%',
                padding: '8px'
            }}>
                <Text fontSize={16} lineHeight={1.5}>{metadata.headline}</Text>
                <Text fontSize={14} opacity={0.6}>{metadata.description}</Text>
            </Box>
        </Flex>
    );
};

export default CouponCard;
