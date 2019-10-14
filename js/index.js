const $btn_find = document.getElementById('btn_find');
const $container = document.getElementById('container');

/* Functions for finding data in the GitHub API */
const findUser = async (username) => {
    const url = `https://api.github.com/users/${username}`;
    return await fetch(url)
        .then( res => res.json() );
}

const findUserRepos = async (username) => {
    const url = `https://api.github.com/users/${username}/repos`;
    return await fetch(url)
        .then( res => res.json() );
}

const findUserStars = async (username) => {
    const url = `https://api.github.com/users/${username}/starred`;
    return await fetch(url)
        .then( res => res.json() );
}

const findUserFollowers = async (username) => {
    const url = `https://api.github.com/users/${username}/followers`;
    return await fetch(url)
        .then( res => res.json() );
}

const findUserFollowing = async (username) => {
    const url = `https://api.github.com/users/${username}/following`;
    return await fetch(url)
        .then( res => res.json() );
}

/* receives - $container and username
 * returns - nothing
 */
const displayOnScreen = ($container, username) => {

    /* Remove all elements from container */ 
    while ($container.firstChild)
        $container.removeChild($container.firstChild);

    const $dataContainer = document.createElement('div');
    $dataContainer.id = 'data-container';

    findUser(username).then( userData => {

        /* Checks if the request message was 404 and displays an error */
        if (userData.message === "Not Found") {
            $dataContainer.innerHTML = `
                <div class="content center">
                    <strong id="not-found">User not found</strong>
                </div>
            `;

            /* Add our element in DOM */
            $container.appendChild($dataContainer);

            return false;
        }

        findUserRepos(username).then( reposData => {
            findUserStars(username).then( starsData => {
                findUserFollowers(username).then( followersData => {
                    findUserFollowing(username).then( followingData => {

                        $dataContainer.innerHTML = `
                            <div class="content center">
                                <div id="user-data">
                                    <img src="${userData.avatar_url}" />
            
                                    <strong>${userData.name ? userData.name : userData.login}</strong>
                                    ${userData.name ? `<span>${userData.login}</span>` : ''}
            
                                    ${userData.location ? `
                                        <div>
                                            <svg viewBox="0 0 12 16" width="12" height="16">
                                                <path fill-rule="evenodd" d="M6 0C2.69 0 0 2.5 0 5.5 0 10.02 6 16 6 16s6-5.98 6-10.5C12 2.5 9.31 0 6 0zm0 14.55C4.14 12.52 1 8.44 1 5.5 1 3.02 3.25 1 6 1c1.34 0 2.61.48 3.56 1.36.92.86 1.44 1.97 1.44 3.14 0 2.94-3.14 7.02-5 9.05zM8 5.5c0 1.11-.89 2-2 2-1.11 0-2-.89-2-2 0-1.11.89-2 2-2 1.11 0 2 .89 2 2z"></path>
                                                <span style="color: #000">${userData.location}</span>
                                            </svg>
                                        </div>` : ''}
                                </div>
            
                                <div id="tabs-data">
                                    <nav id="tabs-menu">
                                        <ul>
                                            <li id="repositories" style="border-bottom: solid 3px #db773e !important;">Repositories <span>${userData.public_repos ? `${userData.public_repos}` : '0'}</span></li>
                                            <li id="stars">Stars <span>${starsData.length > 0 ? `${starsData.length}` : '0'}</span></li>
                                            <li id="followers">Followers <span>${userData.followers ? `${userData.followers}` : '0'}</span></li>
                                            <li id="following">Following <span>${userData.following ? `${userData.following}` : '0'}</span></li>
                                        </ul>
                                    </nav>
            
                                    <div id="tab-repositories" class="tab-item">
                                        <ul id="repos-data" class="two-column">
                                            ${(() => {
                                                return reposData.reduce( (acc, repo) => `${acc}
                                                    <li>
                                                        <header>${repo.name}</header>

                                                        <footer>
                                                            ${repo.language ? `<span><strong style="background: ${languageColor(repo.language)}">....</strong> ${repo.language}</span>` : ''}
            
                                                            ${repo.stargazers_count ? `
                                                                <svg viewBox="0 0 14 16" width="14" height="16">
                                                                    <path fill="#586069" fill-rule="evenodd" d="M14 6l-4.9-.64L7 1 4.9 5.36 0 6l3.6 3.26L2.67 14 7 11.67 11.33 14l-.93-4.74L14 6z"></path>
                                                                </svg>
                                                                <span>${repo.stargazers_count}</span>` : ''}
            
                                                            ${repo.forks ? `
                                                                <svg viewBox="0 0 10 16" width="10" height="16">
                                                                    <path fill="#586069" fill-rule="evenodd" d="M8 1a1.993 1.993 0 0 0-1 3.72V6L5 8 3 6V4.72A1.993 1.993 0 0 0 2 1a1.993 1.993 0 0 0-1 3.72V6.5l3 3v1.78A1.993 1.993 0 0 0 5 15a1.993 1.993 0 0 0 1-3.72V9.5l3-3V4.72A1.993 1.993 0 0 0 8 1zM2 4.2C1.34 4.2.8 3.65.8 3c0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2zm3 10c-.66 0-1.2-.55-1.2-1.2 0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2zm3-10c-.66 0-1.2-.55-1.2-1.2 0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2z"></path>
                                                                </svg>
                                                                <span>${repo.forks}</span>` : ''}
                                                        </footer>
                                                    </li>
                                                `, '');
                                            })()}
                                        </ul>
                                    </div>
            
                                    <div id="tab-stars" class="tab-item" style="display: none">
                                        <ul id="stars-data" class="one-column">
                                            ${(() => {
                                                return starsData.reduce( (acc, repo) => `${acc}
                                                    <li>
                                                        <header>${repo.full_name}</header>
                                                        <footer>
                                                            ${repo.language ? `<span><strong style="background: ${languageColor(repo.language)}">....</strong> ${repo.language}</span>` : ''}
            
                                                            ${repo.stargazers_count ? `
                                                                <svg viewBox="0 0 14 16" width="14" height="16">
                                                                    <path fill="#586069" fill-rule="evenodd" d="M14 6l-4.9-.64L7 1 4.9 5.36 0 6l3.6 3.26L2.67 14 7 11.67 11.33 14l-.93-4.74L14 6z"></path>
                                                                </svg>
                                                                <span>${repo.stargazers_count}</span>` : ''}
            
                                                            ${repo.forks ? `
                                                                <svg viewBox="0 0 10 16" width="10" height="16">
                                                                    <path fill="#586069" fill-rule="evenodd" d="M8 1a1.993 1.993 0 0 0-1 3.72V6L5 8 3 6V4.72A1.993 1.993 0 0 0 2 1a1.993 1.993 0 0 0-1 3.72V6.5l3 3v1.78A1.993 1.993 0 0 0 5 15a1.993 1.993 0 0 0 1-3.72V9.5l3-3V4.72A1.993 1.993 0 0 0 8 1zM2 4.2C1.34 4.2.8 3.65.8 3c0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2zm3 10c-.66 0-1.2-.55-1.2-1.2 0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2zm3-10c-.66 0-1.2-.55-1.2-1.2 0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2z"></path>
                                                                </svg>
                                                                <span>${repo.forks}</span>` : ''}
                                                        </footer>
                                                    </li>
                                                `, '');
                                            })()}
                                        </ul>
                                    </div>
            
                                    <div id="tab-followers" class="tab-item" style="display: none">
                                        <ul class="follow-data one-column">
                                            ${(() => {
                                                return followersData.reduce( (acc, user) => `${acc}
                                                <li>
                                                    <img src="${user.avatar_url}" />
                                                    <span class="redirect-user">${user.login}</span>
                                                </li>
                                            `, '');
                                            })()}
                                        </ul>
                                    </div>
            
                                    <div id="tab-following" class="tab-item" style="display: none">
                                        <ul class="follow-data one-column">
                                            ${(() => {
                                                return followingData.reduce( (acc, user) => `${acc}
                                                <li>
                                                    <img src="${user.avatar_url}" />
                                                    <span class="redirect-user">${user.login}</span>
                                                </li>
                                            `, '');
                                            })()}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        `;
                        
                        /* Add our element in DOM */
                        $container.appendChild($dataContainer);
            
                        /* Tabs */
                        const $repositories = document.getElementById('repositories');
                        const $stars = document.getElementById('stars');
                        const $followers = document.getElementById('followers');
                        const $following = document.getElementById('following');
            
                        $repositories.addEventListener('click', () => openTab('tab-repositories'));
                        $stars.addEventListener('click', () => openTab('tab-stars'));
                        $followers.addEventListener('click', () => openTab('tab-followers'));
                        $following.addEventListener('click', () => openTab('tab-following'));

                        /* Redirect to clicked profile */
                        let users = document.querySelectorAll('.redirect-user');
                        users = Array.prototype.slice.call(users);
                        users.map(user => user.addEventListener('click', () => displayOnScreen($container, user.innerHTML) ));

                        return true;
                    })
                })
            })
        })
    });
}

/* Tabs */
const openTab = (tab) => {
    /* Hide all tabs */
    let tabs = document.querySelectorAll('.tab-item');
    tabs = Array.prototype.slice.call(tabs);
    tabs.map( tab => tab.style.display = 'none' );

    /* Show selected tab */
    const selectedTab = document.getElementById(tab);
    selectedTab.style.display = 'block';

    /* Hide all tabs border bottom in menu */
    let tabsInMenu = document.querySelectorAll('#tabs-menu ul li');
    tabsInMenu = Array.prototype.slice.call(tabsInMenu);
    tabsInMenu.map( tab => tab.style.borderBottom = 'none' );

    /* Show border bottom in the active tab */
    const selectedTabInMenu = document.getElementById(tab.replace('tab-', ''));
    selectedTabInMenu.style = 'border-bottom: solid 3px #db773e !important;'
}

const languageColor = (language) => {
    let color = '#586069'
    switch (language) {
        case 'JavaScript': color = '#f1e05a'; break;
        case 'PHP': color = '#4f5d95'; break;
        case 'C++': color = '#f34b7d'; break;
        case 'CSS': color = '#563d7c'; break;
        case 'Shell': color = '#89e051'; break;
        case 'HTML': color = '#e34c26'; break;
        case 'C#': color = '#178600'; break;
        case 'Java': color = '#b07219'; break;
        case 'Python': color = '#3572a5'; break;
        case 'Shell': color = '#89e051'; break;
    }

    return color;
} 

/* Button click event */
$btn_find.addEventListener('click', () => displayOnScreen($container, document.getElementById('txt_user').value));