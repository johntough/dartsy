import React, {useEffect, useState} from "react";
import {toast} from "react-toastify";

const GameConfiguration = ({ userSubject, userName, matchId, setMatchId }) => {

    const [users, setUsers] = useState([]);
    const [challengedUser, setChallengedUser] = useState(null);

    useEffect(() => {

    }, []);

    const configureMatch = () => {

        if (!challengedUser) return;

        const matchConfig = {
            initiatorUserSubject: userSubject,
            initiatorUserName: userName,
            challengedUserSubject: challengedUser.idpSubject,
            challengedUserName: challengedUser.name,
        };

        fetch(`http://localhost:8080/match/configure`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(matchConfig)
        })
            .then((response) => {
                if (response.status === 401) {
                    throw new Error("Unauthorized");
                }

                if (!response.ok) {
                    throw new Error("Something went wrong.");
                }

                return response.text();
                // TODO: set localstorage with match id when match is originally configured
            })
            .then((matchId) => {
                setMatchId(matchId);
                localStorage.setItem('matchId', matchId);
            })
            .catch(error => {
                toast.error(error.message);
                console.error('Error configuring match');
            });
    };

    const getUsers = () => {
        fetch(`http://localhost:8080/users`,{
            method: 'GET',
            credentials: 'include'
        })
            .then((response) => {
                if (response.status === 401) {
                    throw new Error("Unauthorized");
                }

                if (!response.ok) {
                    throw new Error("Something went wrong.");
                }

                return response.json();
            })
            .then(data => {
                setUsers(data);
            })
            .catch(error => {
                toast.error(error.message);
                console.error('Error getting active matches');
            });
    };

    return (
        <div>
        <p>Match ID: {matchId || 'Not configured'}</p>
        <div>
            <select
                className="user-search-select"
                value={challengedUser?.idpSubject || ""}
                onChange={(e) => {
                    const selectedUser = users.find(user => user.idpSubject === e.target.value);
                    setChallengedUser(selectedUser || null)
                }}
            >
                <option value="">-- Select a User --</option>
                {users.map(user => (
                    <option key={user.idpSubject} value={user.idpSubject}>
                        {user.name}
                    </option>
                ))}
            </select>
            <button className="button" onClick={getUsers}>Search for player to challenge</button>
            <button className="button" onClick={configureMatch} disabled={!challengedUser}>Configure Match</button>
        </div>
        </div>
    );
};

export default GameConfiguration;