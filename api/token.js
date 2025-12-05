import { AccessToken } from "livekit-server-sdk";

export default function handler(req, res) {
  try {
    const apiKey = process.env.LIVEKIT_API_KEY;
    const apiSecret = process.env.LIVEKIT_API_SECRET;
    const wsUrl = process.env.LIVEKIT_URL;
    const agentId = process.env.LIVEKIT_AGENT_ID;

    if (!apiKey || !apiSecret || !wsUrl || !agentId) {
      return res.status(500).json({
        error: "Missing environment variables.",
        received: { apiKey, apiSecret, wsUrl, agentId }
      });
    }

    // Create access token
    const at = new AccessToken(apiKey, apiSecret, {
      identity: "tester-" + Math.random().toString(36).substring(2),
    });

    // Give permission to join the agent
    at.addGrant({
      agent: {
        room: agentId,
      },
    });

    const token = at.toJwt();

    return res.status(200).json({
      token,
      wsUrl
    });

  } catch (err) {
    console.error("Token error:", err);
    return res.status(500).json({ error: err.message });
  }
}
