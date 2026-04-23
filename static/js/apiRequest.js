async function safeJson(response) {
    try {
        return await response.json()
    } catch (error) {
        return {}
    }
}

async function startRunRequest() {
    const response = await fetch('/api/run/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    })

    const data = await safeJson(response)

    if (!response.ok) {
        return { ok: false, error: data.error}
    }

    return { ok: true, roundId: data.round_id }
}

async function finishRunRequest(roundId, name) {
    const response = await fetch('/api/run/finish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            round_id: roundId,
            name: name
        })
    })

    const data = await safeJson(response)

    if (!response.ok) {
        return { ok: false, error: data.error}
    }

    return { ok: true, score: data.score }
}

async function getLeaderboardRequest(limit = 10) {
    const response = await fetch(`/api/leaderboard?limit=${limit}`)
    const data = await safeJson(response)

    if (!response.ok) {
        return { ok: false, error: data.error}
    }

    return { ok: true, leaderboard: data.leaderboard || [] }
}

export { startRunRequest, finishRunRequest, getLeaderboardRequest }
