export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  const key = process.env.ANTHROPIC_API_KEY;
  
  if (!key) {
    return res.status(200).json({ 
      status: 'ERROR',
      message: 'ANTHROPIC_API_KEY 环境变量未设置！',
      allEnvKeys: Object.keys(process.env).filter(k => !k.includes('npm') && !k.includes('PATH'))
    });
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': key,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5',
        max_tokens: 100,
        messages: [{ role: 'user', content: '回复：OK' }]
      })
    });

    const data = await response.json();
    return res.status(200).json({
      status: response.ok ? 'SUCCESS' : 'API_ERROR',
      httpStatus: response.status,
      keyPrefix: key.substring(0, 15) + '...',
      response: data
    });

  } catch (err) {
    return res.status(200).json({ status: 'FETCH_ERROR', error: err.message });
  }
}
