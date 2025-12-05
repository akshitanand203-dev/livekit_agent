import { AccessToken } from "livekit-server-sdk";

export default function handler(req, res) {
  try {
    const apiKey = process.env.LIVEKIT_API_KEY;
    const apiSecret = process.env.LIVEKIT_API_SECRET;
    const wsUrl = process.env.LIVEKIT_URL;
    const agentId = process.env.LIVEKIT_AGENT_ID;

    if (!apiKey || !apiSecret || !wsUrl || !agentId) {
      return res.status(500).json({ error: "Missing env vars" });
    }

    const token = new AccessToken(apiKey, apiSecret, {
      identity: "tester-" + Math.random().toString(36).slice(2),
    });

    token.addGrant({
      room: agentId,      // join the agent's room
      roomJoin: true
    });

    return res.status(200).json({
      token: token.toJwt(),
      wsUrl
    });

  } catch (err) {
    console.error("Token error:", err);
    return res.status(500).json({ error: err.message });
  }
}
