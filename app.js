const { useState, useEffect } = React;
const { User, Building2, Calendar, Settings, Phone, Mail, MapPin, Clock, Star, Plus, Edit2, Trash2, Eye, EyeOff } = lucide;

const BeautyApp = () => {
  // Estados principais
  const [currentView, setCurrentView] = useState('login');
  const [userType, setUserType] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  // Dados simulados (em produção, viriam de uma API/banco de dados)
  const [users, setUsers] = useState([
    { id: 1, email: 'admin@salao.com', password: '123456', type: 'business', name: 'Salão Beleza Total', phone: '(48) 99999-9999', address: 'Rua das Flores, 123 - Tijucas/SC' },
    { id: 2, email: 'cliente@email.com', password: '123456', type: 'client', name: 'Maria Silva', phone: '(48) 88888-8888' }
  ]);

  const [businesses, setBusinesses] = useState([
    { 
      id: 1, 
      name: 'Salão Beleza Total', 
      email: 'admin@salao.com',
      phone: '(48) 99999-9999', 
      address: 'Rua das Flores, 123 - Tijucas/SC',
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=300&h=200&fit=crop'
    }
  ]);

  const [services, setServices] = useState([
    { id: 1, businessId: 1, name: 'Corte Feminino', price: 45.00, duration: 60, description: 'Corte moderno e estiloso' },
    { id: 2, businessId: 1, name: 'Coloração', price: 120.00, duration: 120, description: 'Coloração completa com produtos de qualidade' },
    { id: 3, businessId: 1, name: 'Escova', price: 35.00, duration: 45, description: 'Escova modeladora' },
    { id: 4, businessId: 1, name: 'Manicure', price: 25.00, duration: 45, description: 'Cuidados completos para suas unhas' }
  ]);

  const [appointments, setAppointments] = useState([
    { 
      id: 1, 
      clientId: 2, 
      businessId: 1, 
      serviceId: 1, 
      date: '2025-06-10', 
      time: '14:00', 
      status: 'confirmed',
      clientName: 'Maria Silva',
      serviceName: 'Corte Feminino',
      price: 45.00
    }
  ]);

  // Estados do formulário
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    phone: '',
    address: ''
  });

  const [editingService, setEditingService] = useState(null);
  const [newService, setNewService] = useState({
    name: '',
    price: '',
    duration: '',
    description: ''
  });

  // Funções de autenticação
  const handleLogin = () => {
    const user = users.find(u => u.email === formData.email && u.password === formData.password);
    
    if (user) {
      setCurrentUser(user);
      setCurrentView(user.type === 'business' ? 'business-dashboard' : 'client-dashboard');
      setFormData({ email: '', password: '', confirmPassword: '', name: '', phone: '', address: '' });
    } else {
      alert('Email ou senha inválidos!');
    }
  };

  const handleRegister = () => {
    if (formData.password !== formData.confirmPassword) {
      alert('As senhas não coincidem!');
      return;
    }

    if (users.find(u => u.email === formData.email)) {
      alert('Email já cadastrado!');
      return;
    }

    const newUser = {
      id: users.length + 1,
      email: formData.email,
      password: formData.password,
      type: userType,
      name: formData.name,
      phone: formData.phone,
      address: formData.address
    };

    setUsers([...users, newUser]);

    if (userType === 'business') {
      const newBusiness = {
        id: businesses.length + 1,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        rating: 5.0,
        image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=300&h=200&fit=crop'
      };
      setBusinesses([...businesses, newBusiness]);
    }

    alert('Cadastro realizado com sucesso!');
    setCurrentView('login');
    setFormData({ email: '', password: '', confirmPassword: '', name: '', phone: '', address: '' });
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView('login');
  };

  // Funções para serviços
  const handleAddService = () => {
    if (!newService.name || !newService.price || !newService.duration) {
      alert('Por favor, preencha todos os campos obrigatórios');
      return;
    }
    
    const service = {
      id: services.length + 1,
      businessId: currentUser.id,
      name: newService.name,
      price: parseFloat(newService.price),
      duration: parseInt(newService.duration),
      description: newService.description
    };
    setServices([...services, service]);
    setNewService({ name: '', price: '', duration: '', description: '' });
  };

  const handleEditService = (service) => {
    setEditingService(service);
    setNewService({
      name: service.name,
      price: service.price.toString(),
      duration: service.duration.toString(),
      description: service.description
    });
  };

  const handleUpdateService = () => {
    if (!newService.name || !newService.price || !newService.duration) {
      alert('Por favor, preencha todos os campos obrigatórios');
      return;
    }
    
    setServices(services.map(s => 
      s.id === editingService.id 
        ? { ...s, name: newService.name, price: parseFloat(newService.price), duration: parseInt(newService.duration), description: newService.description }
        : s
    ));
    setEditingService(null);
    setNewService({ name: '', price: '', duration: '', description: '' });
  };

  const handleDeleteService = (serviceId) => {
    if (confirm('Tem certeza que deseja excluir este serviço?')) {
      setServices(services.filter(s => s.id !== serviceId));
    }
  };

  // Função para agendar serviço
  const handleBookService = (service, date, time) => {
    const appointment = {
      id: appointments.length + 1,
      clientId: currentUser.id,
      businessId: service.businessId,
      serviceId: service.id,
      date,
      time,
      status: 'confirmed',
      clientName: currentUser.name,
      serviceName: service.name,
      price: service.price
    };
    setAppointments([...appointments, appointment]);
    alert('Agendamento realizado com sucesso!');
  };

  // Componente de Login
  const LoginForm = () => (
    React.createElement('div', { className: "min-h-screen bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center p-4" },
      React.createElement('div', { className: "bg-white rounded-2xl shadow-xl p-8 w-full max-w-md" },
        React.createElement('div', { className: "text-center mb-8" },
          React.createElement('h1', { className: "text-3xl font-bold text-gray-800 mb-2" }, "Beauty App"),
          React.createElement('p', { className: "text-gray-600" }, "Sistema de agendamento para salões de beleza")
        ),

        React.createElement('div', { className: "space-y-6" },
          React.createElement('div', null,
            React.createElement('label', { className: "block text-sm font-medium text-gray-700 mb-2" }, "Email"),
            React.createElement('input', {
              type: "email",
              required: true,
              className: "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent",
              value: formData.email,
              onChange: (e) => setFormData({...formData, email: e.target.value}),
              placeholder: "seu@email.com"
            })
          ),

          React.createElement('div', null,
            React.createElement('label', { className: "block text-sm font-medium text-gray-700 mb-2" }, "Senha"),
            React.createElement('div', { className: "relative" },
              React.createElement('input', {
                type: showPassword ? "text" : "password",
                required: true,
                className: "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent pr-12",
                value: formData.password,
                onChange: (e) => setFormData({...formData, password: e.target.value}),
                placeholder: "Sua senha"
              }),
              React.createElement('button', {
                type: "button",
                className: "absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500",
                onClick: () => setShowPassword(!showPassword)
              },
                showPassword ? React.createElement(EyeOff, { size: 20 }) : React.createElement(Eye, { size: 20 })
              )
            )
          ),

          React.createElement('button', {
            onClick: handleLogin,
            className: "w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-pink-600 hover:to-purple-700 transition duration-300"
          }, "Entrar")
        ),

        React.createElement('div', { className: "mt-6 text-center" },
          React.createElement('p', { className: "text-gray-600 mb-4" }, "Não tem uma conta?"),
          React.createElement('div', { className: "space-y-3" },
            React.createElement('button', {
              onClick: () => {setCurrentView('register'); setUserType('client');},
              className: "w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300 flex items-center justify-center gap-2"
            },
              React.createElement(User, { size: 20 }),
              "Cadastrar como Cliente"
            ),
            React.createElement('button', {
              onClick: () => {setCurrentView('register'); setUserType('business');},
              className: "w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition duration-300 flex items-center justify-center gap-2"
            },
              React.createElement(Building2, { size: 20 }),
              "Cadastrar como Empresa"
            )
          )
        ),

        React.createElement('div', { className: "mt-6 text-center" },
          React.createElement('p', { className: "text-sm text-gray-500" },
            "Demo: admin@salao.com / cliente@email.com (senha: 123456)"
          )
        )
      )
    )
  );

  // Renderização principal
  if (currentView === 'login') {
    return LoginForm();
  }

  return React.createElement('div', { className: "min-h-screen bg-gray-100 flex items-center justify-center" },
    React.createElement('div', { className: "text-center" },
      React.createElement('h1', { className: "text-4xl font-bold text-gray-800 mb-4" }, "🚧 Em Desenvolvimento"),
      React.createElement('p', { className: "text-gray-600 mb-8" }, "Outras telas em breve..."),
      React.createElement('button', {
        onClick: () => setCurrentView('login'),
        className: "bg-pink-500 text-white px-6 py-3 rounded-lg hover:bg-pink-600"
      }, "Voltar ao Login")
    )
  );
};
