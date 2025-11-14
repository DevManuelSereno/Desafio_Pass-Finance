// Script de teste para validar todos os endpoints da API
// Execute com: node test-api.mjs (certifique-se de que o dev server está rodando)

const BASE_URL = 'http://localhost:3000';

async function testEndpoint(method, url, body = null, description) {
  console.log(`\n🧪 Testando: ${description}`);
  console.log(`   ${method} ${url}`);
  
  try {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };
    
    if (body) {
      options.body = JSON.stringify(body);
    }
    
    const response = await fetch(url, options);
    const statusText = response.ok ? '✅' : '❌';
    console.log(`   Status: ${statusText} ${response.status} ${response.statusText}`);
    
    if (response.status !== 204) {
      const data = await response.json();
      console.log(`   Response:`, JSON.stringify(data, null, 2).substring(0, 300));
    }
    
    return { success: response.ok, data: response.status !== 204 ? await response.clone().json() : null };
  } catch (error) {
    console.log(`   ❌ Erro:`, error.message);
    return { success: false, error: error.message };
  }
}

async function runTests() {
  console.log('🚀 Iniciando testes de API do Pass Finance\n');
  console.log('⚠️  Certifique-se de que o dev server está rodando (npm run dev)');
  console.log('⚠️  E que o banco de dados PostgreSQL está acessível\n');
  
  let contaId = null;
  let pagamentoId = null;
  
  // 1. GET /api/contas (listar com paginação)
  await testEndpoint(
    'GET',
    `${BASE_URL}/api/contas?page=1&limit=10`,
    null,
    'Listar contas com paginação'
  );
  
  // 2. POST /api/contas (criar nova conta)
  const novaConta = {
    conta: `TESTE-${Date.now()}`,
    lancamento: new Date().toISOString(),
    credor: 'Fornecedor Teste',
    devedor: 'Empresa Teste',
    competencia: '2025-01-15',
    vencimento: '2025-02-15',
    numeroParcela: 1,
    totalParcelas: 3,
    valor: 1000,
    desconto: 50,
    juros: 10,
    classificacaoGerencial: 'Teste Operacional',
  };
  
  const createResult = await testEndpoint(
    'POST',
    `${BASE_URL}/api/contas`,
    novaConta,
    'Criar nova conta a pagar'
  );
  
  if (createResult.success && createResult.data) {
    contaId = createResult.data.id;
    console.log(`   ✅ Conta criada com ID: ${contaId}`);
  }
  
  // 3. GET /api/contas/[id] (buscar conta específica)
  if (contaId) {
    await testEndpoint(
      'GET',
      `${BASE_URL}/api/contas/${contaId}`,
      null,
      `Buscar conta ID ${contaId} com pagamentos`
    );
    
    // 4. PUT /api/contas/[id] (atualizar conta)
    await testEndpoint(
      'PUT',
      `${BASE_URL}/api/contas/${contaId}`,
      { 
        classificacaoGerencial: 'Teste Operacional Atualizado',
        notas: 'Atualizado via teste automatizado'
      },
      `Atualizar conta ID ${contaId}`
    );
    
    // 5. POST /api/contas/[id]/pagamentos (criar pagamento)
    const novoPagamento = {
      total: 300,
      caixa: 'Caixa Principal',
      tipo: 'Transferência',
      dataPagamento: new Date().toISOString(),
    };
    
    const pagamentoResult = await testEndpoint(
      'POST',
      `${BASE_URL}/api/contas/${contaId}/pagamentos`,
      novoPagamento,
      `Criar pagamento para conta ID ${contaId}`
    );
    
    if (pagamentoResult.success && pagamentoResult.data) {
      pagamentoId = pagamentoResult.data.id;
      console.log(`   ✅ Pagamento criado com ID: ${pagamentoId}`);
    }
    
    // 6. GET /api/contas/[id]/pagamentos (listar pagamentos da conta)
    await testEndpoint(
      'GET',
      `${BASE_URL}/api/contas/${contaId}/pagamentos`,
      null,
      `Listar pagamentos da conta ID ${contaId}`
    );
    
    // 7. DELETE /api/pagamentos/[pagamentoId] (deletar pagamento)
    if (pagamentoId) {
      await testEndpoint(
        'DELETE',
        `${BASE_URL}/api/pagamentos/${pagamentoId}`,
        null,
        `Deletar pagamento ID ${pagamentoId}`
      );
    }
    
    // 8. DELETE /api/contas/[id] (deletar conta)
    await testEndpoint(
      'DELETE',
      `${BASE_URL}/api/contas/${contaId}`,
      null,
      `Deletar conta ID ${contaId}`
    );
  }
  
  // 9. GET /api/analytics (buscar dados analíticos)
  await testEndpoint(
    'GET',
    `${BASE_URL}/api/analytics`,
    null,
    'Buscar dados de analytics (agregações)'
  );
  
  console.log('\n✨ Testes concluídos!\n');
}

runTests().catch(console.error);
