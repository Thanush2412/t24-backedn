const { supabase } = require('../config/supabase');

class DatabaseService {
  // Personal Info methods
  async getPersonalInfo() {
    const { data, error } = await supabase
      .from('personal_info')
      .select('*')
      .limit(1)
      .single();
    
    if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
      throw new Error(`Failed to fetch personal info: ${error.message}`);
    }
    
    return data ? {
      name: data.name,
      title: data.title,
      subtitle: data.subtitle,
      greeting: data.greeting,
      description: data.description,
      profileImage: data.profile_image,
      updatedAt: data.updated_at
    } : null;
  }

  async updatePersonalInfo(personalInfo) {
    // First check if record exists
    const { data: existingData } = await supabase
      .from('personal_info')
      .select('id')
      .limit(1);
    
    let result;
    
    if (existingData && existingData.length > 0) {
      // Update existing record
      const { data, error } = await supabase
        .from('personal_info')
        .update({
          name: personalInfo.name,
          title: personalInfo.title,
          subtitle: personalInfo.subtitle,
          greeting: personalInfo.greeting,
          description: personalInfo.description,
          profile_image: personalInfo.profileImage,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingData[0].id)
        .select()
        .single();
      
      if (error) {
        throw new Error(`Failed to update personal info: ${error.message}`);
      }
      result = data;
    } else {
      // Insert new record
      const { data, error } = await supabase
        .from('personal_info')
        .insert([{
          name: personalInfo.name,
          title: personalInfo.title,
          subtitle: personalInfo.subtitle,
          greeting: personalInfo.greeting,
          description: personalInfo.description,
          profile_image: personalInfo.profileImage,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();
      
      if (error) {
        throw new Error(`Failed to create personal info: ${error.message}`);
      }
      result = data;
    }
    
    // Transform to match expected format
    return {
      name: result.name,
      title: result.title,
      subtitle: result.subtitle,
      greeting: result.greeting,
      description: result.description,
      profileImage: result.profile_image,
      updatedAt: result.updated_at
    };
  }

  // Projects methods
  async getProjects() {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      throw new Error(`Failed to fetch projects: ${error.message}`);
    }
    
    return data.map(project => ({
      id: project.id,
      title: project.title,
      description: project.description,
      image: project.image,
      technologies: project.technologies,
      githubUrl: project.github_url,
      liveUrl: project.live_url,
      category: project.category
    }));
  }

  async createProject(project) {
    const { data, error } = await supabase
      .from('projects')
      .insert([{
        title: project.title,
        description: project.description,
        image: project.image,
        technologies: project.technologies,
        github_url: project.githubUrl,
        live_url: project.liveUrl,
        category: project.category
      }])
      .select()
      .single();
    
    if (error) {
      throw new Error(`Failed to create project: ${error.message}`);
    }
    
    return data;
  }

  async updateProject(id, project) {
    const { data, error } = await supabase
      .from('projects')
      .update({
        title: project.title,
        description: project.description,
        image: project.image,
        technologies: project.technologies,
        github_url: project.githubUrl,
        live_url: project.liveUrl,
        category: project.category,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      throw new Error(`Failed to update project: ${error.message}`);
    }
    
    return data;
  }

  async deleteProject(id) {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);
    
    if (error) {
      throw new Error(`Failed to delete project: ${error.message}`);
    }
  }

  // Web Projects methods
  async getWebProjects() {
    const { data, error } = await supabase
      .from('web_projects')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      throw new Error(`Failed to fetch web projects: ${error.message}`);
    }
    
    return data.map(project => ({
      id: project.id,
      title: project.title,
      description: project.description,
      image: project.image,
      technologies: project.technologies,
      githubUrl: project.github_url,
      liveUrl: project.live_url,
      category: project.category
    }));
  }

  async createWebProject(project) {
    const { data, error } = await supabase
      .from('web_projects')
      .insert([{
        title: project.title,
        description: project.description,
        image: project.image,
        technologies: project.technologies,
        github_url: project.githubUrl,
        live_url: project.liveUrl,
        category: project.category || 'Web Development'
      }])
      .select()
      .single();
    
    if (error) {
      throw new Error(`Failed to create web project: ${error.message}`);
    }
    
    return data;
  }

  async updateWebProject(id, project) {
    const { data, error } = await supabase
      .from('web_projects')
      .update({
        title: project.title,
        description: project.description,
        image: project.image,
        technologies: project.technologies,
        github_url: project.githubUrl,
        live_url: project.liveUrl,
        category: project.category,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      throw new Error(`Failed to update web project: ${error.message}`);
    }
    
    return data;
  }

  async deleteWebProject(id) {
    const { error } = await supabase
      .from('web_projects')
      .delete()
      .eq('id', id);
    
    if (error) {
      throw new Error(`Failed to delete web project: ${error.message}`);
    }
  }

  // Skills methods
  async getSkills() {
    const { data, error } = await supabase
      .from('skills')
      .select('*')
      .order('name');
    
    if (error) {
      throw new Error(`Failed to fetch skills: ${error.message}`);
    }
    
    return data.map(skill => ({
      id: skill.id,
      name: skill.name,
      level: skill.level,
      category: skill.category
    }));
  }

  async createSkill(skill) {
    const { data, error } = await supabase
      .from('skills')
      .insert([{
        name: skill.name,
        level: skill.level,
        category: skill.category
      }])
      .select()
      .single();
    
    if (error) {
      throw new Error(`Failed to create skill: ${error.message}`);
    }
    
    return data;
  }

  async updateSkill(id, skill) {
    const { data, error } = await supabase
      .from('skills')
      .update({
        name: skill.name,
        level: skill.level,
        category: skill.category,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      throw new Error(`Failed to update skill: ${error.message}`);
    }
    
    return data;
  }

  async deleteSkill(id) {
    const { error } = await supabase
      .from('skills')
      .delete()
      .eq('id', id);
    
    if (error) {
      throw new Error(`Failed to delete skill: ${error.message}`);
    }
  }

  // Tools methods
  async getTools() {
    const { data, error } = await supabase
      .from('tools')
      .select('*')
      .order('name');
    
    if (error) {
      throw new Error(`Failed to fetch tools: ${error.message}`);
    }
    
    return data.map(tool => ({
      id: tool.id,
      name: tool.name,
      icon: tool.icon,
      category: tool.category
    }));
  }

  async createTool(tool) {
    const { data, error } = await supabase
      .from('tools')
      .insert([{
        name: tool.name,
        icon: tool.icon,
        category: tool.category
      }])
      .select()
      .single();
    
    if (error) {
      throw new Error(`Failed to create tool: ${error.message}`);
    }
    
    return data;
  }

  async updateTool(id, tool) {
    const { data, error } = await supabase
      .from('tools')
      .update({
        name: tool.name,
        icon: tool.icon,
        category: tool.category,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      throw new Error(`Failed to update tool: ${error.message}`);
    }
    
    return data;
  }

  async deleteTool(id) {
    const { error } = await supabase
      .from('tools')
      .delete()
      .eq('id', id);
    
    if (error) {
      throw new Error(`Failed to delete tool: ${error.message}`);
    }
  }

  // Image upload to Supabase Storage
  async uploadImage(fileName, fileBuffer, bucket = 'visionreports') {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, fileBuffer, {
        contentType: 'image/*',
        upsert: true
      });
    
    if (error) {
      throw new Error(`Failed to upload image: ${error.message}`);
    }
    
    // Get public URL
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName);
    
    return urlData.publicUrl;
  }

  // Health check
  async healthCheck() {
    try {
      const { data, error } = await supabase
        .from('personal_info')
        .select('count', { count: 'exact' });
      
      if (error) {
        throw error;
      }
      
      return { status: 'connected', timestamp: new Date().toISOString() };
    } catch (error) {
      throw new Error(`Database health check failed: ${error.message}`);
    }
  }
}

module.exports = new DatabaseService();
