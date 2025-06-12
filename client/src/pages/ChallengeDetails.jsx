import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Container,
  Paper,
  Button,
  Link as MuiLink,
  Chip,
  Divider
} from "@mui/material";
import { getChallengeById } from "../services/api"; // You need to implement this API call

const ChallengeDetails = () => {
  const { id } = useParams();
  const [challenge, setChallenge] = useState(null);
  const [loading, setLoading] = useState(true);

 useEffect(() => {
  const fetchChallenge = async () => {
    setLoading(true);
    try {
      const challenge = await getChallengeById(id);
      setChallenge(challenge);
    } catch (err) {
      setChallenge(null);
    }
    setLoading(false);
  };
  fetchChallenge();
}, [id]);


  console.log("Challenge Details:", id);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <Typography variant="h6">Loading...</Typography>
      </Box>
    );
  }

  if (!challenge) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <Typography variant="h6" color="error">Challenge not found.</Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        {challenge.imageUrl && (
          <Box mb={3} display="flex" justifyContent="center">
            <img
              src={challenge.imageUrl}
              alt={challenge.title}
              style={{ maxWidth: "100%", maxHeight: 320, borderRadius: 8 }}
            />
          </Box>
        )}
        <Typography variant="h4" fontWeight={700} gutterBottom>
          {challenge.title}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          {challenge.description}
        </Typography>
        <Divider sx={{ my: 2 }} />
        <Typography variant="body1" sx={{ mb: 2 }}>
          {challenge.longDescription}
        </Typography>
        <Chip label={`${challenge.totalDays} Days`} sx={{ mr: 2 }} />
        <Chip label={`${challenge.participantCount} Participants`} />
        <Divider sx={{ my: 3 }} />

        {/* External Links */}
        {challenge.externalLink && challenge.externalLink.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              Resources / External Links
            </Typography>
            {challenge.externalLink.map((link, idx) => (
              <MuiLink
                key={idx}
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                sx={{ display: "block", mb: 1 }}
              >
                {link}
              </MuiLink>
            ))}
          </Box>
        )}

        {/* PDFs */}
        {challenge.pdfs && challenge.pdfs.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              PDF Resources
            </Typography>
            {challenge.pdfs.map((pdf, idx) => (
              <MuiLink
                key={idx}
                href={pdf}
                target="_blank"
                rel="noopener noreferrer"
                sx={{ display: "block", mb: 1 }}
              >
                PDF {idx + 1}
              </MuiLink>
            ))}
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default ChallengeDetails;