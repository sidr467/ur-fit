import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  CardActions,
  Box
} from '@mui/material';

const ChallengeCard = ({
  challenge,
  isJoined,
  onJoin,
  isCoordinator = false
}) => {
  const cardImage = challenge.imageUrl;

  return (
    <Card sx={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      border: '1px solid #e0e0e0',
      borderRadius: '8px',
      overflow: 'hidden',
      transition: 'all 0.3s ease',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 6px 12px rgba(0,0,0,0.15)',
        borderColor: '#333'
      }
    }}>
      <Box sx={{
        height: 180,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        backgroundColor: '#f5f5f5'
      }}>
        {cardImage && (
          <img
            src={cardImage}
            alt={challenge.title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              padding: '16px'
            }}
          />
        )}
      </Box>
      <CardContent sx={{
        flex: '1 0 auto',
        display: 'flex',
        flexDirection: 'column',
        p: 2.5,
        pb: 0
      }}>
        <Typography
          gutterBottom
          variant="h6"
          component="h3"
          sx={{
            fontWeight: 600,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}
        >
          {challenge.title}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            flex: '1 0 auto'
          }}
        >
          {challenge.description}
        </Typography>
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          mt: 'auto',
          pt: 1.5,
          borderTop: '1px solid rgba(0,0,0,0.05)'
        }}>
          <Typography variant="caption" sx={{ fontWeight: 500 }}>
            {challenge.totalDays} days
          </Typography>
          <Typography variant="caption" sx={{ fontWeight: 500 }}>
            {challenge.participantCount} participants
          </Typography>
        </Box>
      </CardContent>
      <CardActions sx={{
        p: 2,
        pt: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {isCoordinator ? (
          <Button
            fullWidth
            variant="contained"
            size="medium"
            onClick={() => onJoin(challenge._id)}
            sx={{
              height: 42,
              fontWeight: 500,
              borderRadius: '4px',
              backgroundColor: '#000',
              color: '#fff',
              '&:hover': {
                backgroundColor: '#333'
              }
            }}
          >
            Edit Challenge
          </Button>
        ) : (
          <Button
            fullWidth
            variant={isJoined ? "outlined" : "contained"}
            size="medium"
            onClick={() => !isJoined && onJoin(challenge._id)}
            disabled={isJoined}
            sx={{
              height: 42,
              fontWeight: 500,
              borderRadius: '4px',
              backgroundColor: isJoined ? 'transparent' : '#000',
              color: isJoined ? '#000' : '#fff',
              borderColor: '#000',
              '&:hover': {
                backgroundColor: isJoined ? 'transparent' : '#333',
                borderColor: '#333'
              },
              '&.Mui-disabled': {
                borderColor: 'rgba(0,0,0,0.12)',
                color: 'rgba(0,0,0,0.26)'
              }
            }}
          >
            {isJoined ? 'Already Joined' : 'Join Challenge'}
          </Button>
        )}
      </CardActions>
    </Card>
  );
};

export default ChallengeCard;