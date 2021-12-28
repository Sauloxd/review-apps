// https://docs.github.com/en/actions/learn-github-actions/events-that-trigger-workflows#push

export const onPullRequestGithubFixture = {
  action: 'synchronize',
  after: '9839dbff11685875100adea8fdbe065bf5517fa7',
  before: 'e0b6a0f07a3c483b72da9c7523601000ad57d182',
  number: 14,
  pull_request: {
    _links: {
      comments: {
        href: 'https://api.github.com/repos/Sauloxd/review-apps/issues/14/comments',
      },
      commits: {
        href: 'https://api.github.com/repos/Sauloxd/review-apps/pulls/14/commits',
      },
      html: {
        href: 'https://github.com/Sauloxd/review-apps/pull/14',
      },
      issue: {
        href: 'https://api.github.com/repos/Sauloxd/review-apps/issues/14',
      },
      review_comment: {
        href: 'https://api.github.com/repos/Sauloxd/review-apps/pulls/comments{/number}',
      },
      review_comments: {
        href: 'https://api.github.com/repos/Sauloxd/review-apps/pulls/14/comments',
      },
      self: {
        href: 'https://api.github.com/repos/Sauloxd/review-apps/pulls/14',
      },
      statuses: {
        href: 'https://api.github.com/repos/Sauloxd/review-apps/statuses/9839dbff11685875100adea8fdbe065bf5517fa7',
      },
    },
    active_lock_reason: null,
    additions: 9,
    assignee: null,
    assignees: [],
    author_association: 'OWNER',
    auto_merge: null,
    base: {
      label: 'Sauloxd:main',
      ref: 'main',
      repo: {
        allow_auto_merge: false,
        allow_forking: true,
        allow_merge_commit: true,
        allow_rebase_merge: true,
        allow_squash_merge: true,
        allow_update_branch: false,
        archive_url:
          'https://api.github.com/repos/Sauloxd/review-apps/{archive_format}{/ref}',
        archived: false,
        assignees_url:
          'https://api.github.com/repos/Sauloxd/review-apps/assignees{/user}',
        blobs_url:
          'https://api.github.com/repos/Sauloxd/review-apps/git/blobs{/sha}',
        branches_url:
          'https://api.github.com/repos/Sauloxd/review-apps/branches{/branch}',
        clone_url: 'https://github.com/Sauloxd/review-apps.git',
        collaborators_url:
          'https://api.github.com/repos/Sauloxd/review-apps/collaborators{/collaborator}',
        comments_url:
          'https://api.github.com/repos/Sauloxd/review-apps/comments{/number}',
        commits_url:
          'https://api.github.com/repos/Sauloxd/review-apps/commits{/sha}',
        compare_url:
          'https://api.github.com/repos/Sauloxd/review-apps/compare/{base}...{head}',
        contents_url:
          'https://api.github.com/repos/Sauloxd/review-apps/contents/{+path}',
        contributors_url:
          'https://api.github.com/repos/Sauloxd/review-apps/contributors',
        created_at: '2020-08-25T00:29:31Z',
        default_branch: 'main',
        delete_branch_on_merge: false,
        deployments_url:
          'https://api.github.com/repos/Sauloxd/review-apps/deployments',
        description: null,
        disabled: false,
        downloads_url:
          'https://api.github.com/repos/Sauloxd/review-apps/downloads',
        events_url: 'https://api.github.com/repos/Sauloxd/review-apps/events',
        fork: false,
        forks: 2,
        forks_count: 2,
        forks_url: 'https://api.github.com/repos/Sauloxd/review-apps/forks',
        full_name: 'Sauloxd/review-apps',
        git_commits_url:
          'https://api.github.com/repos/Sauloxd/review-apps/git/commits{/sha}',
        git_refs_url:
          'https://api.github.com/repos/Sauloxd/review-apps/git/refs{/sha}',
        git_tags_url:
          'https://api.github.com/repos/Sauloxd/review-apps/git/tags{/sha}',
        git_url: 'git://github.com/Sauloxd/review-apps.git',
        has_downloads: true,
        has_issues: true,
        has_pages: true,
        has_projects: true,
        has_wiki: true,
        homepage: null,
        hooks_url: 'https://api.github.com/repos/Sauloxd/review-apps/hooks',
        html_url: 'https://github.com/Sauloxd/review-apps',
        id: 290071259,
        is_template: false,
        issue_comment_url:
          'https://api.github.com/repos/Sauloxd/review-apps/issues/comments{/number}',
        issue_events_url:
          'https://api.github.com/repos/Sauloxd/review-apps/issues/events{/number}',
        issues_url:
          'https://api.github.com/repos/Sauloxd/review-apps/issues{/number}',
        keys_url:
          'https://api.github.com/repos/Sauloxd/review-apps/keys{/key_id}',
        labels_url:
          'https://api.github.com/repos/Sauloxd/review-apps/labels{/name}',
        language: 'JavaScript',
        languages_url:
          'https://api.github.com/repos/Sauloxd/review-apps/languages',
        license: {
          key: 'mit',
          name: 'MIT License',
          node_id: 'MDc6TGljZW5zZTEz',
          spdx_id: 'MIT',
          url: 'https://api.github.com/licenses/mit',
        },
        merges_url: 'https://api.github.com/repos/Sauloxd/review-apps/merges',
        milestones_url:
          'https://api.github.com/repos/Sauloxd/review-apps/milestones{/number}',
        mirror_url: null,
        name: 'review-apps',
        node_id: 'MDEwOlJlcG9zaXRvcnkyOTAwNzEyNTk=',
        notifications_url:
          'https://api.github.com/repos/Sauloxd/review-apps/notifications{?since,all,participating}',
        open_issues: 4,
        open_issues_count: 4,
        owner: {
          avatar_url: 'https://avatars.githubusercontent.com/u/11878589?v=4',
          events_url: 'https://api.github.com/users/Sauloxd/events{/privacy}',
          followers_url: 'https://api.github.com/users/Sauloxd/followers',
          following_url:
            'https://api.github.com/users/Sauloxd/following{/other_user}',
          gists_url: 'https://api.github.com/users/Sauloxd/gists{/gist_id}',
          gravatar_id: '',
          html_url: 'https://github.com/Sauloxd',
          id: 11878589,
          login: 'Sauloxd',
          node_id: 'MDQ6VXNlcjExODc4NTg5',
          organizations_url: 'https://api.github.com/users/Sauloxd/orgs',
          received_events_url:
            'https://api.github.com/users/Sauloxd/received_events',
          repos_url: 'https://api.github.com/users/Sauloxd/repos',
          site_admin: false,
          starred_url:
            'https://api.github.com/users/Sauloxd/starred{/owner}{/repo}',
          subscriptions_url:
            'https://api.github.com/users/Sauloxd/subscriptions',
          type: 'User',
          url: 'https://api.github.com/users/Sauloxd',
        },
        private: false,
        pulls_url:
          'https://api.github.com/repos/Sauloxd/review-apps/pulls{/number}',
        pushed_at: '2021-12-26T16:38:42Z',
        releases_url:
          'https://api.github.com/repos/Sauloxd/review-apps/releases{/id}',
        size: 9440,
        ssh_url: 'git@github.com:Sauloxd/review-apps.git',
        stargazers_count: 5,
        stargazers_url:
          'https://api.github.com/repos/Sauloxd/review-apps/stargazers',
        statuses_url:
          'https://api.github.com/repos/Sauloxd/review-apps/statuses/{sha}',
        subscribers_url:
          'https://api.github.com/repos/Sauloxd/review-apps/subscribers',
        subscription_url:
          'https://api.github.com/repos/Sauloxd/review-apps/subscription',
        svn_url: 'https://github.com/Sauloxd/review-apps',
        tags_url: 'https://api.github.com/repos/Sauloxd/review-apps/tags',
        teams_url: 'https://api.github.com/repos/Sauloxd/review-apps/teams',
        topics: [],
        trees_url:
          'https://api.github.com/repos/Sauloxd/review-apps/git/trees{/sha}',
        updated_at: '2021-12-26T13:08:42Z',
        url: 'https://api.github.com/repos/Sauloxd/review-apps',
        visibility: 'public',
        watchers: 5,
        watchers_count: 5,
      },
      sha: '0ec72fcac8533f44d76be97b78777fe2ad9fb1c9',
      user: {
        avatar_url: 'https://avatars.githubusercontent.com/u/11878589?v=4',
        events_url: 'https://api.github.com/users/Sauloxd/events{/privacy}',
        followers_url: 'https://api.github.com/users/Sauloxd/followers',
        following_url:
          'https://api.github.com/users/Sauloxd/following{/other_user}',
        gists_url: 'https://api.github.com/users/Sauloxd/gists{/gist_id}',
        gravatar_id: '',
        html_url: 'https://github.com/Sauloxd',
        id: 11878589,
        login: 'Sauloxd',
        node_id: 'MDQ6VXNlcjExODc4NTg5',
        organizations_url: 'https://api.github.com/users/Sauloxd/orgs',
        received_events_url:
          'https://api.github.com/users/Sauloxd/received_events',
        repos_url: 'https://api.github.com/users/Sauloxd/repos',
        site_admin: false,
        starred_url:
          'https://api.github.com/users/Sauloxd/starred{/owner}{/repo}',
        subscriptions_url: 'https://api.github.com/users/Sauloxd/subscriptions',
        type: 'User',
        url: 'https://api.github.com/users/Sauloxd',
      },
    },
    body: null,
    changed_files: 5,
    closed_at: null,
    comments: 0,
    comments_url:
      'https://api.github.com/repos/Sauloxd/review-apps/issues/14/comments',
    commits: 3,
    commits_url:
      'https://api.github.com/repos/Sauloxd/review-apps/pulls/14/commits',
    created_at: '2021-12-26T13:12:19Z',
    deletions: 5,
    diff_url: 'https://github.com/Sauloxd/review-apps/pull/14.diff',
    draft: false,
    head: {
      label: 'Sauloxd:issue-8/branch/with/nested/names',
      ref: 'issue-8/branch/with/nested/names',
      repo: {
        allow_auto_merge: false,
        allow_forking: true,
        allow_merge_commit: true,
        allow_rebase_merge: true,
        allow_squash_merge: true,
        allow_update_branch: false,
        archive_url:
          'https://api.github.com/repos/Sauloxd/review-apps/{archive_format}{/ref}',
        archived: false,
        assignees_url:
          'https://api.github.com/repos/Sauloxd/review-apps/assignees{/user}',
        blobs_url:
          'https://api.github.com/repos/Sauloxd/review-apps/git/blobs{/sha}',
        branches_url:
          'https://api.github.com/repos/Sauloxd/review-apps/branches{/branch}',
        clone_url: 'https://github.com/Sauloxd/review-apps.git',
        collaborators_url:
          'https://api.github.com/repos/Sauloxd/review-apps/collaborators{/collaborator}',
        comments_url:
          'https://api.github.com/repos/Sauloxd/review-apps/comments{/number}',
        commits_url:
          'https://api.github.com/repos/Sauloxd/review-apps/commits{/sha}',
        compare_url:
          'https://api.github.com/repos/Sauloxd/review-apps/compare/{base}...{head}',
        contents_url:
          'https://api.github.com/repos/Sauloxd/review-apps/contents/{+path}',
        contributors_url:
          'https://api.github.com/repos/Sauloxd/review-apps/contributors',
        created_at: '2020-08-25T00:29:31Z',
        default_branch: 'main',
        delete_branch_on_merge: false,
        deployments_url:
          'https://api.github.com/repos/Sauloxd/review-apps/deployments',
        description: null,
        disabled: false,
        downloads_url:
          'https://api.github.com/repos/Sauloxd/review-apps/downloads',
        events_url: 'https://api.github.com/repos/Sauloxd/review-apps/events',
        fork: false,
        forks: 2,
        forks_count: 2,
        forks_url: 'https://api.github.com/repos/Sauloxd/review-apps/forks',
        full_name: 'Sauloxd/review-apps',
        git_commits_url:
          'https://api.github.com/repos/Sauloxd/review-apps/git/commits{/sha}',
        git_refs_url:
          'https://api.github.com/repos/Sauloxd/review-apps/git/refs{/sha}',
        git_tags_url:
          'https://api.github.com/repos/Sauloxd/review-apps/git/tags{/sha}',
        git_url: 'git://github.com/Sauloxd/review-apps.git',
        has_downloads: true,
        has_issues: true,
        has_pages: true,
        has_projects: true,
        has_wiki: true,
        homepage: null,
        hooks_url: 'https://api.github.com/repos/Sauloxd/review-apps/hooks',
        html_url: 'https://github.com/Sauloxd/review-apps',
        id: 290071259,
        is_template: false,
        issue_comment_url:
          'https://api.github.com/repos/Sauloxd/review-apps/issues/comments{/number}',
        issue_events_url:
          'https://api.github.com/repos/Sauloxd/review-apps/issues/events{/number}',
        issues_url:
          'https://api.github.com/repos/Sauloxd/review-apps/issues{/number}',
        keys_url:
          'https://api.github.com/repos/Sauloxd/review-apps/keys{/key_id}',
        labels_url:
          'https://api.github.com/repos/Sauloxd/review-apps/labels{/name}',
        language: 'JavaScript',
        languages_url:
          'https://api.github.com/repos/Sauloxd/review-apps/languages',
        license: {
          key: 'mit',
          name: 'MIT License',
          node_id: 'MDc6TGljZW5zZTEz',
          spdx_id: 'MIT',
          url: 'https://api.github.com/licenses/mit',
        },
        merges_url: 'https://api.github.com/repos/Sauloxd/review-apps/merges',
        milestones_url:
          'https://api.github.com/repos/Sauloxd/review-apps/milestones{/number}',
        mirror_url: null,
        name: 'review-apps',
        node_id: 'MDEwOlJlcG9zaXRvcnkyOTAwNzEyNTk=',
        notifications_url:
          'https://api.github.com/repos/Sauloxd/review-apps/notifications{?since,all,participating}',
        open_issues: 4,
        open_issues_count: 4,
        owner: {
          avatar_url: 'https://avatars.githubusercontent.com/u/11878589?v=4',
          events_url: 'https://api.github.com/users/Sauloxd/events{/privacy}',
          followers_url: 'https://api.github.com/users/Sauloxd/followers',
          following_url:
            'https://api.github.com/users/Sauloxd/following{/other_user}',
          gists_url: 'https://api.github.com/users/Sauloxd/gists{/gist_id}',
          gravatar_id: '',
          html_url: 'https://github.com/Sauloxd',
          id: 11878589,
          login: 'Sauloxd',
          node_id: 'MDQ6VXNlcjExODc4NTg5',
          organizations_url: 'https://api.github.com/users/Sauloxd/orgs',
          received_events_url:
            'https://api.github.com/users/Sauloxd/received_events',
          repos_url: 'https://api.github.com/users/Sauloxd/repos',
          site_admin: false,
          starred_url:
            'https://api.github.com/users/Sauloxd/starred{/owner}{/repo}',
          subscriptions_url:
            'https://api.github.com/users/Sauloxd/subscriptions',
          type: 'User',
          url: 'https://api.github.com/users/Sauloxd',
        },
        private: false,
        pulls_url:
          'https://api.github.com/repos/Sauloxd/review-apps/pulls{/number}',
        pushed_at: '2021-12-26T16:38:42Z',
        releases_url:
          'https://api.github.com/repos/Sauloxd/review-apps/releases{/id}',
        size: 9440,
        ssh_url: 'git@github.com:Sauloxd/review-apps.git',
        stargazers_count: 5,
        stargazers_url:
          'https://api.github.com/repos/Sauloxd/review-apps/stargazers',
        statuses_url:
          'https://api.github.com/repos/Sauloxd/review-apps/statuses/{sha}',
        subscribers_url:
          'https://api.github.com/repos/Sauloxd/review-apps/subscribers',
        subscription_url:
          'https://api.github.com/repos/Sauloxd/review-apps/subscription',
        svn_url: 'https://github.com/Sauloxd/review-apps',
        tags_url: 'https://api.github.com/repos/Sauloxd/review-apps/tags',
        teams_url: 'https://api.github.com/repos/Sauloxd/review-apps/teams',
        topics: [],
        trees_url:
          'https://api.github.com/repos/Sauloxd/review-apps/git/trees{/sha}',
        updated_at: '2021-12-26T13:08:42Z',
        url: 'https://api.github.com/repos/Sauloxd/review-apps',
        visibility: 'public',
        watchers: 5,
        watchers_count: 5,
      },
      sha: '9839dbff11685875100adea8fdbe065bf5517fa7',
      user: {
        avatar_url: 'https://avatars.githubusercontent.com/u/11878589?v=4',
        events_url: 'https://api.github.com/users/Sauloxd/events{/privacy}',
        followers_url: 'https://api.github.com/users/Sauloxd/followers',
        following_url:
          'https://api.github.com/users/Sauloxd/following{/other_user}',
        gists_url: 'https://api.github.com/users/Sauloxd/gists{/gist_id}',
        gravatar_id: '',
        html_url: 'https://github.com/Sauloxd',
        id: 11878589,
        login: 'Sauloxd',
        node_id: 'MDQ6VXNlcjExODc4NTg5',
        organizations_url: 'https://api.github.com/users/Sauloxd/orgs',
        received_events_url:
          'https://api.github.com/users/Sauloxd/received_events',
        repos_url: 'https://api.github.com/users/Sauloxd/repos',
        site_admin: false,
        starred_url:
          'https://api.github.com/users/Sauloxd/starred{/owner}{/repo}',
        subscriptions_url: 'https://api.github.com/users/Sauloxd/subscriptions',
        type: 'User',
        url: 'https://api.github.com/users/Sauloxd',
      },
    },
    html_url: 'https://github.com/Sauloxd/review-apps/pull/14',
    id: 810015035,
    issue_url: 'https://api.github.com/repos/Sauloxd/review-apps/issues/14',
    labels: [],
    locked: false,
    maintainer_can_modify: false,
    merge_commit_sha: '9d8c7a45b75c511b2f952ae197954f9445625568',
    mergeable: null,
    mergeable_state: 'unknown',
    merged: false,
    merged_at: null,
    merged_by: null,
    milestone: null,
    node_id: 'PR_kwDOEUoi284wR9k7',
    number: 14,
    patch_url: 'https://github.com/Sauloxd/review-apps/pull/14.patch',
    rebaseable: null,
    requested_reviewers: [],
    requested_teams: [],
    review_comment_url:
      'https://api.github.com/repos/Sauloxd/review-apps/pulls/comments{/number}',
    review_comments: 0,
    review_comments_url:
      'https://api.github.com/repos/Sauloxd/review-apps/pulls/14/comments',
    state: 'open',
    statuses_url:
      'https://api.github.com/repos/Sauloxd/review-apps/statuses/9839dbff11685875100adea8fdbe065bf5517fa7',
    title: '[Issue 8] Nested branch names',
    updated_at: '2021-12-26T16:38:44Z',
    url: 'https://api.github.com/repos/Sauloxd/review-apps/pulls/14',
    user: {
      avatar_url: 'https://avatars.githubusercontent.com/u/11878589?v=4',
      events_url: 'https://api.github.com/users/Sauloxd/events{/privacy}',
      followers_url: 'https://api.github.com/users/Sauloxd/followers',
      following_url:
        'https://api.github.com/users/Sauloxd/following{/other_user}',
      gists_url: 'https://api.github.com/users/Sauloxd/gists{/gist_id}',
      gravatar_id: '',
      html_url: 'https://github.com/Sauloxd',
      id: 11878589,
      login: 'Sauloxd',
      node_id: 'MDQ6VXNlcjExODc4NTg5',
      organizations_url: 'https://api.github.com/users/Sauloxd/orgs',
      received_events_url:
        'https://api.github.com/users/Sauloxd/received_events',
      repos_url: 'https://api.github.com/users/Sauloxd/repos',
      site_admin: false,
      starred_url:
        'https://api.github.com/users/Sauloxd/starred{/owner}{/repo}',
      subscriptions_url: 'https://api.github.com/users/Sauloxd/subscriptions',
      type: 'User',
      url: 'https://api.github.com/users/Sauloxd',
    },
  },
  repository: {
    allow_forking: true,
    archive_url:
      'https://api.github.com/repos/Sauloxd/review-apps/{archive_format}{/ref}',
    archived: false,
    assignees_url:
      'https://api.github.com/repos/Sauloxd/review-apps/assignees{/user}',
    blobs_url:
      'https://api.github.com/repos/Sauloxd/review-apps/git/blobs{/sha}',
    branches_url:
      'https://api.github.com/repos/Sauloxd/review-apps/branches{/branch}',
    clone_url: 'https://github.com/Sauloxd/review-apps.git',
    collaborators_url:
      'https://api.github.com/repos/Sauloxd/review-apps/collaborators{/collaborator}',
    comments_url:
      'https://api.github.com/repos/Sauloxd/review-apps/comments{/number}',
    commits_url:
      'https://api.github.com/repos/Sauloxd/review-apps/commits{/sha}',
    compare_url:
      'https://api.github.com/repos/Sauloxd/review-apps/compare/{base}...{head}',
    contents_url:
      'https://api.github.com/repos/Sauloxd/review-apps/contents/{+path}',
    contributors_url:
      'https://api.github.com/repos/Sauloxd/review-apps/contributors',
    created_at: '2020-08-25T00:29:31Z',
    default_branch: 'main',
    deployments_url:
      'https://api.github.com/repos/Sauloxd/review-apps/deployments',
    description: null,
    disabled: false,
    downloads_url: 'https://api.github.com/repos/Sauloxd/review-apps/downloads',
    events_url: 'https://api.github.com/repos/Sauloxd/review-apps/events',
    fork: false,
    forks: 2,
    forks_count: 2,
    forks_url: 'https://api.github.com/repos/Sauloxd/review-apps/forks',
    full_name: 'Sauloxd/review-apps',
    git_commits_url:
      'https://api.github.com/repos/Sauloxd/review-apps/git/commits{/sha}',
    git_refs_url:
      'https://api.github.com/repos/Sauloxd/review-apps/git/refs{/sha}',
    git_tags_url:
      'https://api.github.com/repos/Sauloxd/review-apps/git/tags{/sha}',
    git_url: 'git://github.com/Sauloxd/review-apps.git',
    has_downloads: true,
    has_issues: true,
    has_pages: true,
    has_projects: true,
    has_wiki: true,
    homepage: null,
    hooks_url: 'https://api.github.com/repos/Sauloxd/review-apps/hooks',
    html_url: 'https://github.com/Sauloxd/review-apps',
    id: 290071259,
    is_template: false,
    issue_comment_url:
      'https://api.github.com/repos/Sauloxd/review-apps/issues/comments{/number}',
    issue_events_url:
      'https://api.github.com/repos/Sauloxd/review-apps/issues/events{/number}',
    issues_url:
      'https://api.github.com/repos/Sauloxd/review-apps/issues{/number}',
    keys_url: 'https://api.github.com/repos/Sauloxd/review-apps/keys{/key_id}',
    labels_url:
      'https://api.github.com/repos/Sauloxd/review-apps/labels{/name}',
    language: 'JavaScript',
    languages_url: 'https://api.github.com/repos/Sauloxd/review-apps/languages',
    license: {
      key: 'mit',
      name: 'MIT License',
      node_id: 'MDc6TGljZW5zZTEz',
      spdx_id: 'MIT',
      url: 'https://api.github.com/licenses/mit',
    },
    merges_url: 'https://api.github.com/repos/Sauloxd/review-apps/merges',
    milestones_url:
      'https://api.github.com/repos/Sauloxd/review-apps/milestones{/number}',
    mirror_url: null,
    name: 'review-apps',
    node_id: 'MDEwOlJlcG9zaXRvcnkyOTAwNzEyNTk=',
    notifications_url:
      'https://api.github.com/repos/Sauloxd/review-apps/notifications{?since,all,participating}',
    open_issues: 4,
    open_issues_count: 4,
    owner: {
      avatar_url: 'https://avatars.githubusercontent.com/u/11878589?v=4',
      events_url: 'https://api.github.com/users/Sauloxd/events{/privacy}',
      followers_url: 'https://api.github.com/users/Sauloxd/followers',
      following_url:
        'https://api.github.com/users/Sauloxd/following{/other_user}',
      gists_url: 'https://api.github.com/users/Sauloxd/gists{/gist_id}',
      gravatar_id: '',
      html_url: 'https://github.com/Sauloxd',
      id: 11878589,
      login: 'Sauloxd',
      node_id: 'MDQ6VXNlcjExODc4NTg5',
      organizations_url: 'https://api.github.com/users/Sauloxd/orgs',
      received_events_url:
        'https://api.github.com/users/Sauloxd/received_events',
      repos_url: 'https://api.github.com/users/Sauloxd/repos',
      site_admin: false,
      starred_url:
        'https://api.github.com/users/Sauloxd/starred{/owner}{/repo}',
      subscriptions_url: 'https://api.github.com/users/Sauloxd/subscriptions',
      type: 'User',
      url: 'https://api.github.com/users/Sauloxd',
    },
    private: false,
    pulls_url:
      'https://api.github.com/repos/Sauloxd/review-apps/pulls{/number}',
    pushed_at: '2021-12-26T16:38:42Z',
    releases_url:
      'https://api.github.com/repos/Sauloxd/review-apps/releases{/id}',
    size: 9440,
    ssh_url: 'git@github.com:Sauloxd/review-apps.git',
    stargazers_count: 5,
    stargazers_url:
      'https://api.github.com/repos/Sauloxd/review-apps/stargazers',
    statuses_url:
      'https://api.github.com/repos/Sauloxd/review-apps/statuses/{sha}',
    subscribers_url:
      'https://api.github.com/repos/Sauloxd/review-apps/subscribers',
    subscription_url:
      'https://api.github.com/repos/Sauloxd/review-apps/subscription',
    svn_url: 'https://github.com/Sauloxd/review-apps',
    tags_url: 'https://api.github.com/repos/Sauloxd/review-apps/tags',
    teams_url: 'https://api.github.com/repos/Sauloxd/review-apps/teams',
    topics: [],
    trees_url:
      'https://api.github.com/repos/Sauloxd/review-apps/git/trees{/sha}',
    updated_at: '2021-12-26T13:08:42Z',
    url: 'https://api.github.com/repos/Sauloxd/review-apps',
    visibility: 'public',
    watchers: 5,
    watchers_count: 5,
  },
  sender: {
    avatar_url: 'https://avatars.githubusercontent.com/u/11878589?v=4',
    events_url: 'https://api.github.com/users/Sauloxd/events{/privacy}',
    followers_url: 'https://api.github.com/users/Sauloxd/followers',
    following_url:
      'https://api.github.com/users/Sauloxd/following{/other_user}',
    gists_url: 'https://api.github.com/users/Sauloxd/gists{/gist_id}',
    gravatar_id: '',
    html_url: 'https://github.com/Sauloxd',
    id: 11878589,
    login: 'Sauloxd',
    node_id: 'MDQ6VXNlcjExODc4NTg5',
    organizations_url: 'https://api.github.com/users/Sauloxd/orgs',
    received_events_url: 'https://api.github.com/users/Sauloxd/received_events',
    repos_url: 'https://api.github.com/users/Sauloxd/repos',
    site_admin: false,
    starred_url: 'https://api.github.com/users/Sauloxd/starred{/owner}{/repo}',
    subscriptions_url: 'https://api.github.com/users/Sauloxd/subscriptions',
    type: 'User',
    url: 'https://api.github.com/users/Sauloxd',
  },
};

export type GithubPullRequestPayload = typeof onPullRequestGithubFixture;
