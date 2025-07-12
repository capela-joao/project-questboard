type Params = {
  // page: string;
  // pageSize: string;
  search: string;
  // genre: string;
  // platform: string;
  // ordering: string;
  // stores: string;
  // searchExact: string;
  // searchPrecise: string;
};

export const searchGames = async (query: string, token: string) => {
  if (!token) {
    throw new Error('Usuário não autenticado. Token ausente.');
  }

  const API_URL = 'https://questboard-games-api-dfh4c8emeqgwgjbd.eastasia-01.azurewebsites.net';

  try {
    const url = new URL(`${API_URL}/catalogo/rawg/searchGames`);

    const params: Params = {
      // page: "1",
      // pageSize: "5",
      search: query,
      // genre: "action",
      // platform: "1",
      // ordering: "released",
      // stores: "1",
      // searchExact: "true",
      // searchPrecise: "true",
    };

    Object.keys(params).forEach(key => url.searchParams.append(key, params[key as keyof Params]));

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        Authorization: `${token}`,
        'Content-Type': 'application/json',
      },
    });

    console.log(response);

    if (!response.ok) {
      throw new Error(`Erro ao buscar jogos: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Resposta da API:', data);
    return data.results;
  } catch (err: any) {
    console.error('Erro na requisição:', err.message);
    return [];
  }
};

export const getTopGames = async (token: string) => {
  const API_URL = 'https://questboard-games-api-dfh4c8emeqgwgjbd.eastasia-01.azurewebsites.net';

  const response = await fetch(`${API_URL}/catalogo/rawg/getTopGames`, {
    method: 'GET',
    headers: {
      Authorization: `${token}`,
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'Erro ao criar post.');
  }

  return response.json();
};
