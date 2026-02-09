const http = require('http');

function request(options, data) {
    return new Promise((resolve, reject) => {
        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                try {
                    resolve({ status: res.statusCode, body: JSON.parse(body) });
                } catch (e) {
                    resolve({ status: res.statusCode, body });
                }
            });
        });
        req.on('error', reject);
        if (data) req.write(JSON.stringify(data));
        req.end();
    });
}

async function verify() {
    console.log("Starting Verification...");

    // 1. Register (Randomize username to avoid conflict on re-run)
    const username = `testvoter_${Date.now()}`;
    console.log(`1. Registering user '${username}'...`);
    const regRes = await request({
        hostname: 'localhost', port: 5000, path: '/api/auth/register', method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    }, { username: username, password: 'password' });

    if (regRes.status !== 201) {
        console.error("Registration failed:", regRes.body);
        process.exit(1);
    }
    console.log("Registration success.");

    // 2. Login
    console.log("2. Logging in...");
    const loginRes = await request({
        hostname: 'localhost', port: 5000, path: '/api/auth/login', method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    }, { username: username, password: 'password' });

    if (loginRes.status !== 200) {
        console.error("Login failed:", loginRes.body);
        process.exit(1);
    }
    const token = loginRes.body.token;
    console.log("Login successful. Token received.");

    // 3. Get Candidates (Before Vote)
    console.log("3. Fetching candidates...");
    const candidatesRes = await request({
        hostname: 'localhost', port: 5000, path: '/api/candidates', method: 'GET'
    });
    const candidateArg = candidatesRes.body.find(c => c.name === 'Joseph Vijay');
    if (!candidateArg) {
        console.error("Candidate 'Joseph Vijay' not found! Candidates:", candidatesRes.body);
        process.exit(1);
    }
    const initialVotes = candidateArg.voteCount;
    // console.log(`Joseph Vijay currently has ${initialVotes} votes.`);

    // 4. Vote
    console.log("4. Casting vote for Joseph Vijay...");
    const voteRes = await request({
        hostname: 'localhost', port: 5000, path: '/api/vote', method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    }, { candidateId: candidateArg.id });

    if (voteRes.status !== 200) {
        console.error("Voting failed:", voteRes.body);
        process.exit(1);
    } else {
        console.log("Vote cast successfully. Tx Hash:", voteRes.body.transactionHash);
    }

    // 5. Verify Count
    console.log("5. Verifying vote count...");

    // Tiny wait for local blockchain to update (it's usually instant but just in case)
    await new Promise(r => setTimeout(r, 1000));

    const checkRes = await request({
        hostname: 'localhost', port: 5000, path: '/api/candidates', method: 'GET'
    });
    const updatedCandidate = checkRes.body.find(c => c.name === 'Joseph Vijay');
    console.log(`Joseph Vijay now has ${updatedCandidate.voteCount} votes.`);

    if (updatedCandidate.voteCount > initialVotes) {
        console.log("VERIFICATION SUCCESSFUL!");
    } else {
        console.error("Vote count did not increase!");
        process.exit(1);
    }
}

verify().catch(console.error);
