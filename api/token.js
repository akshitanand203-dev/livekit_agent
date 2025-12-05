import { AccessToken } from "livekit-server-sdk";

export default function handler(req, res) {
  const apiKey = process.env.LIVEKIT_API_KEY;
  const apiSecret = process.env.LIVEKIT_API_SECRET;
  const agentId = process.env.LIVEKIT_AGENT_ID; 
  const wsUrl = process.env.LIVEKIT_URL; 

  const at = new AccessToken(apiKey, apiSecret, {
    identity: "tester-" + Math.random().toString(36).slice(2),
  });

  at.addGrant({
    agent: {
      room: agentId,
    },
  });

  const token = at.toJwt();
  res.status(200).json({ token, wsUrl });
}
