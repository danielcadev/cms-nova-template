// Dummy projects library to satisfy build requirements

export async function getProjectBySlug(slug: string) {
    return {
        id: '1',
        title: 'Dummy Project',
        slug,
        description: 'A dummy project description'
    };
}

export async function getAllProjects() {
    return [];
}
