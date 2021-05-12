const { uid } = require('rand-token')

router.post("/", [authenticateToken], async(req, res) => {
    const wordArr = req.body.wordArr;

    let sum = 0;
    for (var i = 0; i < wordArr.length; i++) {
        if (words.wordlist.indexOf(wordArr[i]) !== -1) {
            sum += wordArr[i].length * 2;
        }
    }

    let field = {
        email: req.user.email,
        score: sum,
        username: req.user.username,
    };

    const document = db
        .collection("leaderboard")
        .where("email", "==", req.user.email);
    if (document) {
        // await db
        //     .collection("leaderboard")
        //     .doc(req.user.email)
        //     .set(field, { merge: true })
        //     .then(() => res.json({ email: req.user.email }))
        //     .catch((error) => res.status(500).send(error));
        document.get().then(function(querySnapshot) {
            querySnapshot.forEach(async function(doc) {
                const details = doc.data();
                console.log(details.score);
                if (sum > details.score) {
                    await document.update({
                        score: sum,
                    });
                }
                res.status(200).send(sum);
            });
        });
    } else {

        const id = uid(20)
        db.collection("leaderboard").doc(id).set({
                email: req.body.email,
                score: sum
            })
            .then(() => {
                console.log("Document successfully written!");
            })
            .catch((error) => {
                console.error("Error writing document: ", error);
            });
    }
});