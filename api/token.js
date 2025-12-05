import { AccessToken } from "livekit-server-sdk";

export default function handler(req, res) {
  try {
    const apiKey = process.env.LIVEKIT_API_KEY;
    const apiSecret = process.env.LIVEKIT_API_SECRET;
    const wsUrl = process.env.LIVEKIT_URL;
    const agentId = process.env.LIVEKIT_AGENT_ID;

    if (!apiKey || !apiSecret || !wsUrl || !agentId) {
      return res.status(500).json({
        error: "Missing environment variables",
        received: { apiKey, apiSecret, wsUrl, agentId }
      });
    }

    // Create access token
    const token = new AccessToken(apiKey, apiSecret, {
      identity: "tester-" + Math.random().toString(36).slice(2),
    });

    // Correct grant structure for LiveKit Agents
    token.addGrant({
      room: agentId,     // allow joining this agent room
      roomJoin: true,    // allow connecting to room
      agent: true        // allow agent mode
    });

    return res.status(200).json({
      token: token.toJwt(),
      wsUrl
    });

  } catch (err) {
    console.error("Token generation error:", err);
    return res.status(500).json({ error: err.message });
  }
}
